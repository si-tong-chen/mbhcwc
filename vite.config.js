import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import { basename, extname, join, resolve } from 'path';
import { appendFile, mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import { devLogger } from '@meituan-nocode/vite-plugin-dev-logger';
import {
  devHtmlTransformer,
  prodHtmlTransformer,
} from '@meituan-nocode/vite-plugin-nocode-html-transformer';
import react from '@vitejs/plugin-react';

const CHAT_VARIABLE = process.env.CHAT_VARIABLE || '';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'wangyan';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wangyan1234';
const APP_BASE_DIR = process.env.APP_BASE_DIR || process.cwd();
const APP_DATA_DIR = process.env.APP_DATA_DIR || join(APP_BASE_DIR, 'data');
const APP_UPLOADS_DIR = process.env.APP_UPLOADS_DIR || join(APP_BASE_DIR, 'uploads');
const APP_BACKUPS_DIR = process.env.APP_BACKUPS_DIR || join(APP_BASE_DIR, 'backups');

const isProdEnv = process.env.NODE_ENV === 'production';
const publicPath = (isProdEnv && CHAT_VARIABLE)
  ? PUBLIC_PATH + '/' + CHAT_VARIABLE
  : PUBLIC_PATH + '/';
const outDir = (isProdEnv && CHAT_VARIABLE) ? 'build/' + CHAT_VARIABLE : 'build';

const dbPath = join(APP_DATA_DIR, 'content.db');
const moduleKeys = [
  'focusNews',
  'associationNotices',
  'internationalProjects',
  'expertVoices',
  'healthLecturesUpcoming',
  'healthLecturesReplay',
  'topicVideos',
  'trainingTracks',
  'trainingCourses',
  'maternalTopics',
  'homeHeroSlides',
  'homeLatestTips',
  'charityHomes',
  'careWorkstations',
  'workstationGallery',
  'associationTeamStructure',
  'products',
  'promoCategories',
  'promoServices'
];

const moduleLabelMap = {
  focusNews: '新闻中心',
  associationNotices: '通知公告',
  internationalProjects: '国际项目',
  expertVoices: '专家之声',
  healthLecturesUpcoming: '近期讲座',
  healthLecturesReplay: '往期讲座回放',
  topicVideos: '专题视频',
  trainingTracks: '培训方向',
  trainingCourses: '培训课程',
  maternalTopics: '专题管理',
  homeHeroSlides: '首页轮播图',
  homeLatestTips: '首页最新提示',
  charityHomes: '公益家园',
  careWorkstations: '关爱工作站',
  workstationGallery: '工作站展示',
  associationTeamStructure: '团队构成',
  products: '产品管理',
  promoCategories: '推广分类',
  promoServices: '项目推广服务'
};

const adminSessions = new Map();
const topicVideoAllowedDomains = ['bilibili.com', 'douyin.com', 'ixigua.com', 'youku.com', 'qq.com', 'youtube.com'];

const parseUrl = (req) => new URL(req.url || '/', 'http://localhost');
const nowIso = () => new Date().toISOString();
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const sanitizeFolderName = (value, fallback = 'media-library') => {
  const text = String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return text || fallback;
};

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const sendJs = (res, code, body) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.end(body);
};

const readJsonBody = (req) =>
  new Promise((resolveBody, rejectBody) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolveBody(raw ? JSON.parse(raw) : {});
      } catch (error) {
        rejectBody(error);
      }
    });
    req.on('error', rejectBody);
  });

const ensureRuntimeDirs = async () => {
  await mkdir(APP_DATA_DIR, { recursive: true });
  await mkdir(APP_UPLOADS_DIR, { recursive: true });
  await mkdir(APP_BACKUPS_DIR, { recursive: true });
};

const sqlEscape = (value) => String(value).replace(/'/g, "''");
const sqlValue = (value) => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `'${sqlEscape(value)}'`;
};

const runSql = (sql) => {
  execFileSync('sqlite3', [dbPath, sql], { stdio: ['ignore', 'pipe', 'pipe'] });
};

const querySql = (sql) => {
  const out = execFileSync('sqlite3', ['-json', dbPath, sql], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const trimmed = out.trim();
  if (!trimmed) return [];
  return JSON.parse(trimmed);
};

const initDb = async () => {
  await ensureRuntimeDirs();
  runSql(`
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS content_items (
      id TEXT PRIMARY KEY,
      module_key TEXT NOT NULL,
      slug TEXT,
      title TEXT,
      status TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      data_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_content_module ON content_items(module_key);
    CREATE INDEX IF NOT EXISTS idx_content_module_status ON content_items(module_key, status);
    CREATE INDEX IF NOT EXISTS idx_content_updated ON content_items(updated_at);

    CREATE TABLE IF NOT EXISTS media_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      module_key TEXT NOT NULL DEFAULT 'media-library',
      folder TEXT NOT NULL DEFAULT 'media-library',
      size INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lead_items (
      id TEXT PRIMARY KEY,
      lead_type TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      city TEXT,
      project TEXT,
      service_slug TEXT,
      category_slug TEXT,
      message TEXT,
      source TEXT,
      data_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created ON lead_items(created_at);

    CREATE TABLE IF NOT EXISTS lead_status (
      lead_id TEXT PRIMARY KEY,
      follow_status TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS operation_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      module_key TEXT NOT NULL,
      target_id TEXT,
      detail TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_logs_created ON operation_logs(created_at);
  `);

  const mediaCols = querySql(`PRAGMA table_info(media_items);`);
  const mediaColNames = new Set((mediaCols || []).map((item) => item.name));
  if (!mediaColNames.has('module_key')) {
    runSql(`ALTER TABLE media_items ADD COLUMN module_key TEXT NOT NULL DEFAULT 'media-library';`);
  }
  if (!mediaColNames.has('folder')) {
    runSql(`ALTER TABLE media_items ADD COLUMN folder TEXT NOT NULL DEFAULT 'media-library';`);
  }
};

const appendLog = (action, moduleKey, targetId, detail = '') => {
  runSql(`
    INSERT INTO operation_logs (id, action, module_key, target_id, detail, created_at)
    VALUES (
      ${sqlValue(makeId('log'))},
      ${sqlValue(action)},
      ${sqlValue(moduleKey)},
      ${sqlValue(targetId)},
      ${sqlValue(detail)},
      ${sqlValue(nowIso())}
    );
  `);
};

const normalizeStatus = (status) => (status === 'published' ? 'published' : 'draft');
const maybeString = (v) => (typeof v === 'string' ? v : '');

const deriveContentTitle = (payload) =>
  maybeString(payload?.title) || maybeString(payload?.name) || maybeString(payload?.slug) || '未命名';

const normalizeUrlDomain = (url) => {
  const text = maybeString(url).trim();
  if (!text) return '';
  try {
    const parsed = new URL(text);
    return parsed.hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return '';
  }
};

const isAllowedTopicVideoDomain = (domain) => {
  if (!domain) return false;
  return topicVideoAllowedDomains.some((item) => domain === item || domain.endsWith(`.${item}`));
};

const validateTopicVideoLink = (url) => {
  const text = maybeString(url).trim();
  if (!text) return { valid: false, reason: '链接不能为空。', domain: '' };
  let parsed;
  try {
    parsed = new URL(text);
  } catch {
    return { valid: false, reason: '链接格式不正确。', domain: '' };
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { valid: false, reason: '仅支持 http/https 链接。', domain: '' };
  }
  const domain = parsed.hostname.replace(/^www\./i, '').toLowerCase();
  if (!isAllowedTopicVideoDomain(domain)) {
    return { valid: false, reason: `不在白名单域名内：${domain}`, domain };
  }
  return { valid: true, domain };
};

const normalizeTopicVideoPayload = (payload = {}) => {
  const cardType = maybeString(payload?.cardType).trim() || 'image_link';
  if (!['image_link', 'embedded_video'].includes(cardType)) {
    throw new Error('卡片类型仅支持 image_link 或 embedded_video。');
  }

  const normalized = {
    ...payload,
    slug: maybeString(payload?.slug).trim(),
    title: maybeString(payload?.title).trim(),
    summary: maybeString(payload?.summary).trim(),
    pageIntro: maybeString(payload?.pageIntro).trim(),
    duration: maybeString(payload?.duration).trim(),
    coverImage: maybeString(payload?.coverImage).trim(),
    cardType,
    topic: maybeString(payload?.topic).trim(),
    playUrl: maybeString(payload?.playUrl).trim(),
    actionUrl: maybeString(payload?.actionUrl).trim(),
    isPinned: Boolean(payload?.isPinned),
    isFeatured: Boolean(payload?.isFeatured),
    publishStartAt: '',
    publishEndAt: '',
    sort_order: Math.max(0, Number(payload?.sort_order || 0)),
    tags: Array.isArray(payload?.tags)
      ? payload.tags.map((item) => String(item || '').trim()).filter(Boolean)
      : []
  };

  if (!normalized.slug) throw new Error('slug 不能为空');
  if (!normalized.title) throw new Error('标题不能为空');

  if (normalized.cardType === 'image_link') {
    if (!normalized.coverImage) throw new Error('图片卡片必须填写封面图。');
    if (!normalized.actionUrl) throw new Error('图片卡片必须填写跳转链接。');
  }
  if (normalized.cardType === 'embedded_video' && !normalized.playUrl) {
    throw new Error('视频卡片必须填写播放链接。');
  }
  if (normalized.cardType === 'image_link') {
    normalized.playUrl = '';
  }
  if (normalized.cardType === 'embedded_video') {
    normalized.coverImage = '';
    normalized.actionUrl = '';
  }

  const playResult = normalized.playUrl ? validateTopicVideoLink(normalized.playUrl) : { valid: true, domain: '' };
  if (normalized.playUrl && !playResult.valid) {
    throw new Error(`播放链接不可用：${playResult.reason}`);
  }
  const actionResult = normalized.actionUrl ? validateTopicVideoLink(normalized.actionUrl) : { valid: true, domain: '' };
  if (normalized.actionUrl && !actionResult.valid) {
    throw new Error(`跳转链接不可用：${actionResult.reason}`);
  }

  normalized.linkDomain = playResult.domain || actionResult.domain || '';
  return normalized;
};

const parseContentRow = (row) => {
  let data = {};
  try {
    data = JSON.parse(row.data_json || '{}');
  } catch {
    data = {};
  }
  return {
    ...data,
    module_key: row.module_key,
    id: row.id,
    status: row.status,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
    published_at: row.published_at
  };
};

const migrateLegacyHealthLectures = () => {
  const legacyCount = Number(querySql(`
    SELECT COUNT(*) AS c FROM content_items WHERE module_key = 'healthLectures';
  `)[0]?.c || 0);
  if (!legacyCount) return;

  const nextCount = Number(querySql(`
    SELECT COUNT(*) AS c FROM content_items
    WHERE module_key IN ('healthLecturesUpcoming', 'healthLecturesReplay');
  `)[0]?.c || 0);
  if (nextCount > 0) return;

  const rows = querySql(`
    SELECT * FROM content_items
    WHERE module_key = 'healthLectures'
    ORDER BY datetime(updated_at) DESC;
  `).map(parseContentRow);

  rows.forEach((row) => {
    const targetModule = maybeString(row?.videoUrl).trim() ? 'healthLecturesReplay' : 'healthLecturesUpcoming';
    const nextData = { ...row, module_key: targetModule };
    runSql(`
      UPDATE content_items
      SET
        module_key = ${sqlValue(targetModule)},
        data_json = ${sqlValue(JSON.stringify(nextData))}
      WHERE id = ${sqlValue(row.id)};
    `);
  });

  appendLog('migrate', 'healthLectures', 'all', '迁移旧健康讲座到近期讲座/往期讲座回放');
};

const listContentRows = (moduleKey, opts = {}) => {
  const q = maybeString(opts.q).trim().toLowerCase();
  const status = maybeString(opts.status);
  const topic = maybeString(opts.topic).trim().toLowerCase();
  const cardType = maybeString(opts.cardType).trim().toLowerCase();
  const tag = maybeString(opts.tag).trim().toLowerCase();
  const page = Math.max(1, Number(opts.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(opts.pageSize || 20)));
  const where = [`module_key = ${sqlValue(moduleKey)}`];
  if (status && status !== 'all') where.push(`status = ${sqlValue(status)}`);
  if (q) {
    const like = `%${q}%`;
    where.push(`(
      LOWER(COALESCE(title, '')) LIKE ${sqlValue(like)} OR
      LOWER(COALESCE(slug, '')) LIKE ${sqlValue(like)} OR
      LOWER(COALESCE(data_json, '')) LIKE ${sqlValue(like)}
    )`);
  }
  if (topic) {
    where.push(`LOWER(COALESCE(data_json, '')) LIKE ${sqlValue(`%"topic":"%${topic}%`)} `);
  }
  if (cardType) {
    where.push(`LOWER(COALESCE(data_json, '')) LIKE ${sqlValue(`%"cardtype":"${cardType}"%`)}`);
  }
  if (tag) {
    where.push(`LOWER(COALESCE(data_json, '')) LIKE ${sqlValue(`%${tag}%`)}`);
  }
  const whereSql = where.join(' AND ');
  const total = querySql(`SELECT COUNT(*) AS c FROM content_items WHERE ${whereSql};`)[0]?.c || 0;
  const start = (page - 1) * pageSize;
  const rows = querySql(`
    SELECT *
    FROM content_items
    WHERE ${whereSql}
    ORDER BY sort_order ASC, datetime(updated_at) DESC
    LIMIT ${pageSize} OFFSET ${start};
  `).map(parseContentRow);
  return { items: rows, total, page, pageSize };
};

const getContentById = (moduleKey, id) => {
  const row = querySql(`
    SELECT * FROM content_items
    WHERE module_key = ${sqlValue(moduleKey)} AND id = ${sqlValue(id)}
    LIMIT 1;
  `)[0];
  return row ? parseContentRow(row) : null;
};

const insertContent = (moduleKey, payload) => {
  const id = maybeString(payload?.id) || makeId(moduleKey);
  const status = normalizeStatus(payload?.status);
  const createdAt = payload?.created_at || nowIso();
  const updatedAt = nowIso();
  const publishedAt = status === 'published' ? (payload?.published_at || nowIso()) : null;
  const slug = maybeString(payload?.slug);
  const title = deriveContentTitle(payload);
  const sortOrder = Number.isFinite(Number(payload?.sort_order)) ? Number(payload.sort_order) : 0;
  const dataJson = JSON.stringify({ ...payload, id, status, sort_order: sortOrder });

  runSql(`
    INSERT INTO content_items (
      id, module_key, slug, title, status, sort_order, data_json, created_at, updated_at, published_at
    ) VALUES (
      ${sqlValue(id)},
      ${sqlValue(moduleKey)},
      ${sqlValue(slug)},
      ${sqlValue(title)},
      ${sqlValue(status)},
      ${sqlValue(sortOrder)},
      ${sqlValue(dataJson)},
      ${sqlValue(createdAt)},
      ${sqlValue(updatedAt)},
      ${sqlValue(publishedAt)}
    );
  `);

  appendLog('create', moduleKey, id, title);
  return getContentById(moduleKey, id);
};

const updateContent = (moduleKey, id, payload) => {
  const current = getContentById(moduleKey, id);
  if (!current) return null;

  const merged = { ...current, ...payload, id };
  const status = normalizeStatus(merged.status);
  const updatedAt = nowIso();
  const publishedAt = status === 'published' ? (current.published_at || nowIso()) : null;
  const slug = maybeString(merged.slug);
  const title = deriveContentTitle(merged);
  const sortOrder = Number.isFinite(Number(merged.sort_order)) ? Number(merged.sort_order) : 0;
  const dataJson = JSON.stringify({ ...merged, status, sort_order: sortOrder, published_at: publishedAt, updated_at: updatedAt });

  runSql(`
    UPDATE content_items
    SET
      slug = ${sqlValue(slug)},
      title = ${sqlValue(title)},
      status = ${sqlValue(status)},
      sort_order = ${sqlValue(sortOrder)},
      data_json = ${sqlValue(dataJson)},
      updated_at = ${sqlValue(updatedAt)},
      published_at = ${sqlValue(publishedAt)}
    WHERE module_key = ${sqlValue(moduleKey)} AND id = ${sqlValue(id)};
  `);

  appendLog('update', moduleKey, id, title);
  return getContentById(moduleKey, id);
};

const deleteContent = (moduleKey, id) => {
  const current = getContentById(moduleKey, id);
  if (!current) return false;
  const mediaUrls = Array.from(collectLocalUploadUrls(current));
  runSql(`DELETE FROM content_items WHERE module_key = ${sqlValue(moduleKey)} AND id = ${sqlValue(id)};`);
  cleanupUnreferencedMediaByUrls(mediaUrls);
  appendLog('delete', moduleKey, id, deriveContentTitle(current));
  return true;
};

const setPublishState = (moduleKey, id, publish) => {
  const current = getContentById(moduleKey, id);
  if (!current) return null;

  const status = publish ? 'published' : 'draft';
  const updatedAt = nowIso();
  const publishedAt = publish ? (current.published_at || nowIso()) : null;
  const next = {
    ...current,
    status,
    published_at: publishedAt,
    updated_at: updatedAt
  };

  const dataJson = JSON.stringify(next);
  runSql(`
    UPDATE content_items
    SET
      status = ${sqlValue(status)},
      published_at = ${sqlValue(publishedAt)},
      updated_at = ${sqlValue(updatedAt)},
      data_json = ${sqlValue(dataJson)}
    WHERE module_key = ${sqlValue(moduleKey)} AND id = ${sqlValue(id)};
  `);

  appendLog(publish ? 'publish' : 'unpublish', moduleKey, id, deriveContentTitle(next));
  return getContentById(moduleKey, id);
};

const hasAuth = (req) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  const expiry = adminSessions.get(token);
  if (!expiry) return false;
  if (expiry < Date.now()) {
    adminSessions.delete(token);
    return false;
  }
  return true;
};

const requireAuth = (req, res) => {
  if (!hasAuth(req)) {
    sendJson(res, 401, { success: false, message: '未登录或登录已失效。' });
    return false;
  }
  return true;
};

const gatherStringMatches = (value, finder, path = '', bucket = []) => {
  if (typeof value === 'string') {
    if (finder(value)) bucket.push(path || '(root)');
    return bucket;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => gatherStringMatches(item, finder, `${path}[${index}]`, bucket));
    return bucket;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => gatherStringMatches(v, finder, path ? `${path}.${k}` : k, bucket));
    return bucket;
  }
  return bucket;
};

const collectLocalUploadUrls = (value, bucket = new Set()) => {
  if (!value) return bucket;
  if (typeof value === 'string') {
    const text = value.trim();
    if (text.startsWith('/uploads/')) bucket.add(text);
    return bucket;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectLocalUploadUrls(item, bucket));
    return bucket;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((item) => collectLocalUploadUrls(item, bucket));
  }
  return bucket;
};

const cleanupUnreferencedMediaByUrls = (urls = []) => {
  if (!Array.isArray(urls) || urls.length === 0) return;
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  const remainingRows = listAllContentRows();
  uniqueUrls.forEach((url) => {
    const media = querySql(`SELECT * FROM media_items WHERE url = ${sqlValue(url)} LIMIT 1;`)[0];
    if (!media) return;
    const isStillReferenced = remainingRows.some((item) => gatherStringMatches(item, (value) => value === url).length > 0);
    if (isStillReferenced) return;
    runSql(`DELETE FROM media_items WHERE id = ${sqlValue(media.id)};`);
    if (existsSync(media.file_path)) {
      unlink(media.file_path).catch(() => {});
    }
    appendLog('delete', 'media', media.id, media.name);
  });
};

const replaceStringDeep = (value, fromValue, toValue) => {
  if (typeof value === 'string') {
    return value === fromValue ? toValue : value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceStringDeep(item, fromValue, toValue));
  }
  if (value && typeof value === 'object') {
    const next = {};
    for (const [k, v] of Object.entries(value)) {
      next[k] = replaceStringDeep(v, fromValue, toValue);
    }
    return next;
  }
  return value;
};

const parseDataUrlImage = (dataUrl) => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  const extMap = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg'
  };
  const ext = extMap[mime] || '.bin';
  return { mime, ext, buffer: Buffer.from(base64, 'base64') };
};

const detectContentType = (filePath) => {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
};

const listAllContentRows = () => querySql(`SELECT * FROM content_items ORDER BY datetime(updated_at) DESC;`).map(parseContentRow);

const listMediaRows = () => querySql(`SELECT * FROM media_items ORDER BY datetime(created_at) DESC;`);

const bootstrapModules = (modules, force) => {
  const total = querySql(`SELECT COUNT(*) AS c FROM content_items;`)[0]?.c || 0;
  if (total > 0 && !force) return { conflict: true };

  runSql(`DELETE FROM content_items;`);

  for (const key of moduleKeys) {
    const rows = Array.isArray(modules?.[key]) ? modules[key] : [];
    rows.forEach((row) => {
      const status = normalizeStatus(row?.status || 'published');
      const createdAt = row?.created_at || nowIso();
      const updatedAt = row?.updated_at || createdAt;
      const publishedAt = status === 'published' ? (row?.published_at || createdAt) : null;
      const id = row?.id || makeId(key);
      const slug = maybeString(row?.slug);
      const title = deriveContentTitle(row);
      const sortOrder = Number.isFinite(Number(row?.sort_order)) ? Number(row.sort_order) : 0;
      const dataJson = JSON.stringify({ ...row, id, status, sort_order: sortOrder });

      runSql(`
        INSERT INTO content_items (
          id, module_key, slug, title, status, sort_order, data_json, created_at, updated_at, published_at
        ) VALUES (
          ${sqlValue(id)},
          ${sqlValue(key)},
          ${sqlValue(slug)},
          ${sqlValue(title)},
          ${sqlValue(status)},
          ${sqlValue(sortOrder)},
          ${sqlValue(dataJson)},
          ${sqlValue(createdAt)},
          ${sqlValue(updatedAt)},
          ${sqlValue(publishedAt)}
        );
      `);
    });
  }

  appendLog('bootstrap', 'all', 'all', '初始化后台数据');
  const count = querySql(`SELECT COUNT(*) AS c FROM content_items;`)[0]?.c || 0;
  return { conflict: false, count };
};

const buildPublishedPayload = () => {
  const modules = {};
  for (const key of moduleKeys) {
    const rows = querySql(`
      SELECT * FROM content_items
      WHERE module_key = ${sqlValue(key)} AND status = 'published'
      ORDER BY sort_order ASC, datetime(updated_at) DESC;
    `).map(parseContentRow);
    modules[key] = rows;
  }
  return {
    generatedAt: nowIso(),
    modules
  };
};

const handleUploadAsset = async (req, res, next) => {
  const { pathname } = parseUrl(req);
  if (!pathname.startsWith('/uploads/')) return next();

  await ensureRuntimeDirs();
  const requested = decodeURIComponent(pathname.slice('/uploads/'.length)).replace(/^\/+/, '');
  const filePath = resolve(APP_UPLOADS_DIR, requested);
  if (!filePath.startsWith(resolve(APP_UPLOADS_DIR))) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  if (!existsSync(filePath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', detectContentType(filePath));
  createReadStream(filePath).pipe(res);
};

const handleCharityParticipation = async (req, res, next) => {
  const { pathname } = parseUrl(req);
  if (pathname !== '/api/charity-participation' || req.method !== 'POST') {
    return next();
  }

  try {
    const body = await readJsonBody(req);
    if (!body?.name || !body?.phone || !body?.city || !body?.project) {
      sendJson(res, 400, { success: false, message: '缺少必填字段。' });
      return;
    }

    const record = {
      id: makeId('lead'),
      createdAt: nowIso(),
      ...body
    };

    runSql(`
      INSERT INTO lead_items (
        id, lead_type, name, phone, city, project, message, source, data_json, created_at
      ) VALUES (
        ${sqlValue(record.id)},
        'charity',
        ${sqlValue(record.name)},
        ${sqlValue(record.phone)},
        ${sqlValue(record.city)},
        ${sqlValue(record.project)},
        ${sqlValue(record.message || '')},
        ${sqlValue(record.source || 'charity-form')},
        ${sqlValue(JSON.stringify(record))},
        ${sqlValue(record.createdAt)}
      );
    `);

    appendLog('lead_create', 'leads', record.id, '公益报名');
    sendJson(res, 200, { success: true, data: record });
  } catch {
    sendJson(res, 500, { success: false, message: '服务异常，请稍后重试。' });
  }
};

const handlePromoInquiry = async (req, res, next) => {
  const { pathname } = parseUrl(req);
  if (pathname !== '/api/promo-inquiry' || req.method !== 'POST') {
    return next();
  }

  try {
    const body = await readJsonBody(req);
    if (!body?.name || !body?.phone || !body?.city || !body?.serviceSlug || !body?.categorySlug) {
      sendJson(res, 400, { success: false, message: '缺少必填字段。' });
      return;
    }

    const record = {
      id: makeId('lead'),
      createdAt: nowIso(),
      ...body
    };

    runSql(`
      INSERT INTO lead_items (
        id, lead_type, name, phone, city, service_slug, category_slug, message, source, data_json, created_at
      ) VALUES (
        ${sqlValue(record.id)},
        'promo',
        ${sqlValue(record.name)},
        ${sqlValue(record.phone)},
        ${sqlValue(record.city)},
        ${sqlValue(record.serviceSlug)},
        ${sqlValue(record.categorySlug)},
        ${sqlValue(record.message || '')},
        ${sqlValue(record.source || 'promo-service-detail')},
        ${sqlValue(JSON.stringify(record))},
        ${sqlValue(record.createdAt)}
      );
    `);

    appendLog('lead_create', 'leads', record.id, '项目咨询');
    sendJson(res, 200, { success: true, data: record });
  } catch {
    sendJson(res, 500, { success: false, message: '服务异常，请稍后重试。' });
  }
};

const handleAdminApi = async (req, res, next) => {
  const url = parseUrl(req);
  const { pathname, searchParams } = url;

  if (pathname === '/api/admin/published.js' && req.method === 'GET') {
    const payload = buildPublishedPayload();
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    sendJs(res, 200, `window.__NOCODE_PUBLISHED_CONTENT__=${JSON.stringify(payload)};`);
    return;
  }

  if (!pathname.startsWith('/api/admin/')) {
    return next();
  }

  if (pathname === '/api/admin/auth/login' && req.method === 'POST') {
    const body = await readJsonBody(req).catch(() => ({}));
    const email = maybeString(body?.email).trim();
    const password = maybeString(body?.password).trim();
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      sendJson(res, 401, { success: false, message: '账号或密码错误。' });
      return;
    }
    const token = makeId('token');
    adminSessions.set(token, Date.now() + 1000 * 60 * 60 * 24);
    sendJson(res, 200, {
      success: true,
      data: {
        token,
        user: { email: ADMIN_EMAIL, role: 'admin' }
      }
    });
    return;
  }

  if (pathname === '/api/admin/auth/me' && req.method === 'GET') {
    if (!requireAuth(req, res)) return;
    sendJson(res, 200, { success: true, data: { email: ADMIN_EMAIL, role: 'admin' } });
    return;
  }

  if (!requireAuth(req, res)) return;

  if (pathname === '/api/admin/bootstrap-needed' && req.method === 'GET') {
    const total = querySql(`SELECT COUNT(*) AS c FROM content_items;`)[0]?.c || 0;
    sendJson(res, 200, { success: true, data: { needed: total === 0 } });
    return;
  }

  if (pathname === '/api/admin/bootstrap' && req.method === 'POST') {
    const body = await readJsonBody(req).catch(() => ({}));
    const result = bootstrapModules(body?.modules || {}, Boolean(body?.force));
    if (result.conflict) {
      sendJson(res, 409, { success: false, message: '已有数据，若需覆盖请传 force=true。' });
      return;
    }
    sendJson(res, 200, { success: true, data: { count: result.count } });
    return;
  }

  if (pathname === '/api/admin/modules' && req.method === 'GET') {
    const data = moduleKeys.map((key) => {
      const rows = querySql(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published
        FROM content_items
        WHERE module_key = ${sqlValue(key)};
      `)[0] || { total: 0, published: 0 };
      const total = Number(rows.total || 0);
      const published = Number(rows.published || 0);
      return {
        key,
        label: moduleLabelMap[key] || key,
        total,
        published,
        draft: total - published
      };
    });
    sendJson(res, 200, { success: true, data });
    return;
  }

  if (pathname === '/api/admin/logs' && req.method === 'GET') {
    const logs = querySql(`
      SELECT id, action, module_key AS module, target_id, detail, created_at
      FROM operation_logs
      ORDER BY datetime(created_at) DESC
      LIMIT 200;
    `);
    sendJson(res, 200, { success: true, data: logs });
    return;
  }

  if (pathname === '/api/admin/media' && req.method === 'GET') {
    const rows = listMediaRows().map((item) => ({
      id: item.id,
      name: item.name,
      filePath: item.file_path,
      url: item.url,
      moduleKey: item.module_key || 'media-library',
      folder: item.folder || 'media-library',
      size: item.size,
      created_at: item.created_at
    }));
    sendJson(res, 200, { success: true, data: rows });
    return;
  }

  if (pathname === '/api/admin/media/upload' && req.method === 'POST') {
    const body = await readJsonBody(req).catch(() => ({}));
    const fileName = maybeString(body?.fileName).trim() || 'image';
    const moduleKey = sanitizeFolderName(body?.moduleKey || 'media-library');
    const dataUrl = maybeString(body?.dataUrl).trim();
    const parsed = parseDataUrlImage(dataUrl);
    if (!parsed) {
      sendJson(res, 400, { success: false, message: '图片数据不合法。' });
      return;
    }

    const safeBaseName = basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
    const finalName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBaseName.replace(/\.[^/.]+$/, '')}${parsed.ext}`;
    const folderPath = join(APP_UPLOADS_DIR, moduleKey);
    await mkdir(folderPath, { recursive: true });
    const filePath = join(folderPath, finalName);
    await writeFile(filePath, parsed.buffer);

    const media = {
      id: makeId('media'),
      name: fileName,
      filePath,
      url: `/uploads/${moduleKey}/${finalName}`,
      moduleKey,
      folder: moduleKey,
      size: Number(body?.size || parsed.buffer.length),
      created_at: nowIso()
    };

    runSql(`
      INSERT INTO media_items (id, name, file_path, url, module_key, folder, size, created_at)
      VALUES (
        ${sqlValue(media.id)},
        ${sqlValue(media.name)},
        ${sqlValue(media.filePath)},
        ${sqlValue(media.url)},
        ${sqlValue(media.moduleKey)},
        ${sqlValue(media.folder)},
        ${sqlValue(media.size)},
        ${sqlValue(media.created_at)}
      );
    `);

    appendLog('upload', 'media', media.id, media.name);
    sendJson(res, 200, { success: true, data: media });
    return;
  }

  if (pathname === '/api/admin/media/replace' && req.method === 'POST') {
    const body = await readJsonBody(req).catch(() => ({}));
    const fromUrl = maybeString(body?.fromUrl).trim();
    const toUrl = maybeString(body?.toUrl).trim();
    if (!fromUrl || !toUrl) {
      sendJson(res, 400, { success: false, message: '替换参数缺失。' });
      return;
    }

    const rows = listAllContentRows();
    rows.forEach((row) => {
      const replaced = replaceStringDeep(row, fromUrl, toUrl);
      const status = normalizeStatus(replaced.status);
      const updatedAt = nowIso();
      runSql(`
        UPDATE content_items
        SET
          slug = ${sqlValue(maybeString(replaced.slug))},
          title = ${sqlValue(deriveContentTitle(replaced))},
          status = ${sqlValue(status)},
          sort_order = ${sqlValue(Number(replaced.sort_order || 0))},
          data_json = ${sqlValue(JSON.stringify(replaced))},
          updated_at = ${sqlValue(updatedAt)}
        WHERE id = ${sqlValue(row.id)};
      `);
    });

    appendLog('replace_media', 'all', 'all', '批量替换媒体引用');
    sendJson(res, 200, { success: true });
    return;
  }

  const mediaRefMatch = pathname.match(/^\/api\/admin\/media\/([^/]+)\/references$/);
  if (mediaRefMatch && req.method === 'GET') {
    const mediaId = decodeURIComponent(mediaRefMatch[1]);
    const media = querySql(`SELECT * FROM media_items WHERE id = ${sqlValue(mediaId)} LIMIT 1;`)[0];
    if (!media) {
      sendJson(res, 404, { success: false, message: '图片不存在。' });
      return;
    }

    const refs = [];
    const allRows = listAllContentRows();
    for (const item of allRows) {
      const paths = gatherStringMatches(item, (value) => value === media.url);
      if (paths.length) {
        refs.push({ module: item.module_key || item.moduleKey || 'unknown', itemId: item.id, paths });
      }
    }
    sendJson(res, 200, { success: true, data: refs });
    return;
  }

  const mediaDeleteMatch = pathname.match(/^\/api\/admin\/media\/([^/]+)$/);
  if (mediaDeleteMatch && req.method === 'DELETE') {
    const mediaId = decodeURIComponent(mediaDeleteMatch[1]);
    const media = querySql(`SELECT * FROM media_items WHERE id = ${sqlValue(mediaId)} LIMIT 1;`)[0];
    if (!media) {
      sendJson(res, 404, { success: false, message: '图片不存在。' });
      return;
    }

    const allRows = listAllContentRows();
    const isUsed = allRows.some((item) => gatherStringMatches(item, (value) => value === media.url).length > 0);
    if (isUsed) {
      sendJson(res, 400, { success: false, message: '该图片存在内容引用，请先替换引用后再删除。' });
      return;
    }

    runSql(`DELETE FROM media_items WHERE id = ${sqlValue(mediaId)};`);
    if (existsSync(media.file_path)) {
      await unlink(media.file_path).catch(() => {});
    }
    appendLog('delete', 'media', mediaId, media.name);
    sendJson(res, 200, { success: true });
    return;
  }

  if (pathname === '/api/admin/leads' && req.method === 'GET') {
    const type = maybeString(searchParams.get('type'));
    const status = maybeString(searchParams.get('status'));
    const q = maybeString(searchParams.get('q')).trim().toLowerCase();

    const where = ['1=1'];
    if (type) where.push(`l.lead_type = ${sqlValue(type)}`);
    if (status) where.push(`COALESCE(s.follow_status, 'new') = ${sqlValue(status)}`);
    if (q) {
      const like = `%${q}%`;
      where.push(`(
        LOWER(COALESCE(l.name, '')) LIKE ${sqlValue(like)} OR
        LOWER(COALESCE(l.phone, '')) LIKE ${sqlValue(like)} OR
        LOWER(COALESCE(l.city, '')) LIKE ${sqlValue(like)} OR
        LOWER(COALESCE(l.message, '')) LIKE ${sqlValue(like)} OR
        LOWER(COALESCE(l.project, '')) LIKE ${sqlValue(like)} OR
        LOWER(COALESCE(l.service_slug, '')) LIKE ${sqlValue(like)}
      )`);
    }

    const rows = querySql(`
      SELECT
        l.id,
        l.lead_type,
        l.name,
        l.phone,
        l.city,
        l.project,
        l.service_slug,
        l.category_slug,
        l.message,
        l.source,
        l.created_at,
        COALESCE(s.follow_status, 'new') AS follow_status
      FROM lead_items l
      LEFT JOIN lead_status s ON s.lead_id = l.id
      WHERE ${where.join(' AND ')}
      ORDER BY datetime(l.created_at) DESC;
    `).map((item) => ({
      id: item.id,
      leadType: item.lead_type,
      name: item.name,
      phone: item.phone,
      city: item.city,
      project: item.project,
      serviceSlug: item.service_slug,
      categorySlug: item.category_slug,
      message: item.message,
      source: item.source,
      createdAt: item.created_at,
      followStatus: item.follow_status
    }));

    sendJson(res, 200, { success: true, data: rows });
    return;
  }

  const leadItemMatch = pathname.match(/^\/api\/admin\/leads\/([^/]+)$/);
  if (leadItemMatch && req.method === 'PUT') {
    const id = decodeURIComponent(leadItemMatch[1]);
    const body = await readJsonBody(req).catch(() => ({}));
    const followStatus = maybeString(body?.followStatus || 'new') || 'new';
    const exists = querySql(`SELECT id FROM lead_items WHERE id = ${sqlValue(id)} LIMIT 1;`)[0];
    if (!exists) {
      sendJson(res, 404, { success: false, message: '线索不存在。' });
      return;
    }

    runSql(`
      INSERT INTO lead_status (lead_id, follow_status, updated_at)
      VALUES (${sqlValue(id)}, ${sqlValue(followStatus)}, ${sqlValue(nowIso())})
      ON CONFLICT(lead_id) DO UPDATE SET
        follow_status = excluded.follow_status,
        updated_at = excluded.updated_at;
    `);
    appendLog('update_lead', 'leads', id, followStatus);
    sendJson(res, 200, { success: true });
    return;
  }

  if (leadItemMatch && req.method === 'DELETE') {
    const id = decodeURIComponent(leadItemMatch[1]);
    const exists = querySql(`SELECT id FROM lead_items WHERE id = ${sqlValue(id)} LIMIT 1;`)[0];
    if (!exists) {
      sendJson(res, 404, { success: false, message: '线索不存在。' });
      return;
    }
    runSql(`DELETE FROM lead_items WHERE id = ${sqlValue(id)};`);
    runSql(`DELETE FROM lead_status WHERE lead_id = ${sqlValue(id)};`);
    appendLog('delete_lead', 'leads', id, '删除线索');
    sendJson(res, 200, { success: true });
    return;
  }

  const moduleListMatch = pathname.match(/^\/api\/admin\/content\/([^/]+)$/);
  if (moduleListMatch && req.method === 'GET') {
    const key = decodeURIComponent(moduleListMatch[1]);
    if (!moduleKeys.includes(key)) {
      sendJson(res, 404, { success: false, message: '未知模块。' });
      return;
    }
    const data = listContentRows(key, {
      page: searchParams.get('page') || 1,
      pageSize: searchParams.get('pageSize') || 20,
      q: searchParams.get('q') || '',
      status: searchParams.get('status') || 'all'
    });
    sendJson(res, 200, { success: true, data });
    return;
  }

  if (moduleListMatch && req.method === 'POST') {
    const key = decodeURIComponent(moduleListMatch[1]);
    if (!moduleKeys.includes(key)) {
      sendJson(res, 404, { success: false, message: '未知模块。' });
      return;
    }
    let body = await readJsonBody(req).catch(() => ({}));
    if (key === 'topicVideos') {
      try {
        body = normalizeTopicVideoPayload(body);
      } catch (error) {
        sendJson(res, 400, { success: false, message: error?.message || '专题视频数据不合法。' });
        return;
      }
    }
    const row = insertContent(key, body);
    sendJson(res, 200, { success: true, data: row });
    return;
  }

  if (pathname === '/api/admin/content/topicVideos/validate-link' && req.method === 'POST') {
    const body = await readJsonBody(req).catch(() => ({}));
    const result = validateTopicVideoLink(maybeString(body?.url).trim());
    sendJson(res, 200, { success: true, data: result });
    return;
  }

  const moduleItemMatch = pathname.match(/^\/api\/admin\/content\/([^/]+)\/([^/]+)$/);
  if (moduleItemMatch && req.method === 'GET') {
    const key = decodeURIComponent(moduleItemMatch[1]);
    const id = decodeURIComponent(moduleItemMatch[2]);
    if (!moduleKeys.includes(key)) {
      sendJson(res, 404, { success: false, message: '未知模块。' });
      return;
    }
    const row = getContentById(key, id);
    if (!row) {
      sendJson(res, 404, { success: false, message: '记录不存在。' });
      return;
    }
    sendJson(res, 200, { success: true, data: row });
    return;
  }

  if (moduleItemMatch && req.method === 'PUT') {
    const key = decodeURIComponent(moduleItemMatch[1]);
    const id = decodeURIComponent(moduleItemMatch[2]);
    if (!moduleKeys.includes(key)) {
      sendJson(res, 404, { success: false, message: '未知模块。' });
      return;
    }
    let body = await readJsonBody(req).catch(() => ({}));
    if (key === 'topicVideos') {
      try {
        body = normalizeTopicVideoPayload(body);
      } catch (error) {
        sendJson(res, 400, { success: false, message: error?.message || '专题视频数据不合法。' });
        return;
      }
    }
    const row = updateContent(key, id, body);
    if (!row) {
      sendJson(res, 404, { success: false, message: '记录不存在。' });
      return;
    }
    sendJson(res, 200, { success: true, data: row });
    return;
  }

  if (moduleItemMatch && req.method === 'DELETE') {
    const key = decodeURIComponent(moduleItemMatch[1]);
    const id = decodeURIComponent(moduleItemMatch[2]);
    if (!moduleKeys.includes(key)) {
      sendJson(res, 404, { success: false, message: '未知模块。' });
      return;
    }
    const ok = deleteContent(key, id);
    if (!ok) {
      sendJson(res, 404, { success: false, message: '记录不存在。' });
      return;
    }
    sendJson(res, 200, { success: true });
    return;
  }

  const publishMatch = pathname.match(/^\/api\/admin\/content\/([^/]+)\/([^/]+)\/(publish|unpublish)$/);
  if (publishMatch && req.method === 'POST') {
    const key = decodeURIComponent(publishMatch[1]);
    const id = decodeURIComponent(publishMatch[2]);
    const action = publishMatch[3];
    if (!moduleKeys.includes(key)) {
      sendJson(res, 404, { success: false, message: '未知模块。' });
      return;
    }
    if (key === 'topicVideos' && action === 'publish') {
      const current = getContentById(key, id);
      if (!current) {
        sendJson(res, 404, { success: false, message: '记录不存在。' });
        return;
      }
      try {
        normalizeTopicVideoPayload(current);
      } catch (error) {
        sendJson(res, 400, { success: false, message: error?.message || '专题视频数据不合法，无法发布。' });
        return;
      }
    }
    const row = setPublishState(key, id, action === 'publish');
    if (!row) {
      sendJson(res, 404, { success: false, message: '记录不存在。' });
      return;
    }
    sendJson(res, 200, { success: true, data: row });
    return;
  }

  sendJson(res, 404, { success: false, message: '接口不存在。' });
};

const adminApiPlugin = () => ({
  name: 'admin-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      handleUploadAsset(req, res, next).catch(next);
    });
    server.middlewares.use((req, res, next) => {
      handleCharityParticipation(req, res, next).catch(next);
    });
    server.middlewares.use((req, res, next) => {
      handlePromoInquiry(req, res, next).catch(next);
    });
    server.middlewares.use((req, res, next) => {
      handleAdminApi(req, res, next).catch(next);
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      handleUploadAsset(req, res, next).catch(next);
    });
    server.middlewares.use((req, res, next) => {
      handleCharityParticipation(req, res, next).catch(next);
    });
    server.middlewares.use((req, res, next) => {
      handlePromoInquiry(req, res, next).catch(next);
    });
    server.middlewares.use((req, res, next) => {
      handleAdminApi(req, res, next).catch(next);
    });
  },
});

async function loadPlugins() {
  await initDb();
  migrateLegacyHealthLectures();

  const plugins = isProdEnv
  ? CHAT_VARIABLE
    ? [react(), prodHtmlTransformer(CHAT_VARIABLE), adminApiPlugin()]
    : [react(), adminApiPlugin()]
  : [
      devLogger({
        dirname: resolve(APP_DATA_DIR, '.nocode-dev-logs'),
        maxFiles: '3d',
      }),
      react(),
      devHtmlTransformer(CHAT_VARIABLE),
      adminApiPlugin(),
    ];

  if (process.env.NOCODE_COMPILER_PATH) {
    const { componentCompiler } = await import(process.env.NOCODE_COMPILER_PATH);
    plugins.push(componentCompiler());
  }
  return plugins;
}

export default defineConfig(async () => {
  const plugins = await loadPlugins();

  return {
    server: {
      host: '::',
      port: '8080',
      hmr: {
        overlay: false,
      },
    },
    plugins,
    base: publicPath,
    build: {
      outDir,
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url)),
        },
        {
          find: 'lib',
          replacement: resolve(__dirname, 'lib'),
        },
      ],
    },
  };
});
