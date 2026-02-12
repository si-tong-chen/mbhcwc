import React, { useEffect, useMemo, useState } from 'react';
import { adminApi, clearAdminToken, getAdminToken, setAdminToken } from '../admin/adminApi';
import { moduleByKey } from '../admin/moduleConfig';
import { buildStaticSeedModules } from '../admin/staticSeed';

const menuItems = [
  { key: 'dashboard', label: '仪表盘' },
  { key: 'content', label: '内容管理' },
  { key: 'media', label: '图片库' },
  { key: 'leads', label: '公益家园报名' },
  { key: 'settings', label: '系统设置' }
];

const contentGroups = [
  {
    title: '首页',
    modules: ['homeHeroSlides', 'homeLatestTips', 'topicVideos', 'associationTeamStructure', 'workstationGallery']
  },
  {
    title: '资讯',
    modules: ['focusNews', 'associationNotices', 'internationalProjects', 'expertVoices', 'healthLecturesUpcoming', 'healthLecturesReplay']
  },
  {
    title: '母婴健康专题',
    modules: ['maternalTopics']
  },
  {
    title: '关爱产品',
    modules: ['products']
  },
  {
    title: '培训',
    modules: ['trainingTracks', 'trainingCourses']
  },
  {
    title: '项目推广',
    modules: ['promoCategories', 'promoServices']
  },
  {
    title: '公益家园',
    modules: ['charityHomes']
  },
  {
    title: '关爱工作站',
    modules: ['careWorkstations']
  }
];

const contentPartitionStatusFilters = [
  { key: 'all', label: '全部' },
  { key: 'hasDraft', label: '有草稿' },
  { key: 'publishedEmpty', label: '已发布为空' }
];

const cardStyle = 'rounded-xl border border-[#E8D8DD] bg-white p-4';

const toLines = (value) => (Array.isArray(value) ? value.join('\n') : '');
const fromLines = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean);
const fromLinesPreserve = (value) => value.split('\n').map((line) => line.replace(/\r/g, ''));
const parseTags = (value) => value.split(/[\n,，、]/).map((item) => item.trim()).filter(Boolean);
const toParagraphs = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean);
const specsToLines = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => {
      const label = String(item?.label || '').trim();
      const itemValue = String(item?.value || '').trim();
      return label || itemValue ? `${label}:${itemValue}` : '';
    })
    .filter(Boolean)
    .join('\n');
const linesToSpecs = (value) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':');
      if (idx < 0) return { label: line, value: '' };
      return {
        label: line.slice(0, idx).trim(),
        value: line.slice(idx + 1).trim()
      };
    })
    .filter((item) => item.label || item.value);
const faqToLines = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => {
      const q = String(item?.q || '').trim();
      const a = String(item?.a || '').trim();
      return q || a ? `${q}|${a}` : '';
    })
    .filter(Boolean)
    .join('\n');
const linesToFaq = (value) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf('|');
      if (idx < 0) return { q: line, a: '' };
      return {
        q: line.slice(0, idx).trim(),
        a: line.slice(idx + 1).trim()
      };
    })
    .filter((item) => item.q || item.a);
const trainingHomeCategoryOptions = ['母婴', '中医', '健康', '其他'];
const trainingDurationOptions = ['4-8周', '8-12周', '12周以上'];
const topicVideoCardTypeOptions = [
  { value: 'image_link', label: '封面图卡片' },
  { value: 'embedded_video', label: '视频直出卡片' }
];
const defaultAdminUi = {
  mode: 'day',
  accent: '#194F92'
};
const loadAdminUi = () => {
  if (typeof window === 'undefined') return defaultAdminUi;
  try {
    const raw = localStorage.getItem('nocode_admin_ui');
    if (!raw) return defaultAdminUi;
    const parsed = JSON.parse(raw);
    const mode = parsed?.mode === 'night' ? 'night' : 'day';
    const accent = String(parsed?.accent || defaultAdminUi.accent);
    return { mode, accent };
  } catch {
    return defaultAdminUi;
  }
};
const adminAccentOptions = [
  { value: '#194F92', label: '海军蓝' },
  { value: '#0F766E', label: '墨绿' },
  { value: '#B45309', label: '琥珀橙' },
  { value: '#7C3AED', label: '紫罗兰' }
];
const dragSortableModules = new Set([
  'homeHeroSlides',
  'homeLatestTips',
  'expertVoices',
  'healthLecturesUpcoming',
  'healthLecturesReplay',
  'topicVideos',
  'maternalTopics',
  'products',
  'trainingTracks',
  'trainingCourses',
  'promoCategories',
  'promoServices',
  'charityHomes',
  'careWorkstations',
  'workstationGallery',
  'associationTeamStructure'
]);
const bySortThenUpdated = (a, b) => {
  const bySort = Number(a?.sort_order || 0) - Number(b?.sort_order || 0);
  if (bySort !== 0) return bySort;
  return String(b?.updated_at || '').localeCompare(String(a?.updated_at || ''));
};
const moveArrayItemByPosition = (rows, fromIndex, toIndex, position = 'before') => {
  if (fromIndex < 0 || toIndex < 0) return rows.slice();
  if (fromIndex === toIndex && position === 'before') return rows.slice();
  const next = rows.slice();
  const [item] = next.splice(fromIndex, 1);
  let insertIndex = position === 'after' ? toIndex + 1 : toIndex;
  if (fromIndex < insertIndex) insertIndex -= 1;
  insertIndex = Math.max(0, Math.min(insertIndex, next.length));
  next.splice(insertIndex, 0, item);
  return next;
};
const getDropPosition = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const y = event.clientY - rect.top;
  return y < rect.height / 2 ? 'before' : 'after';
};
const withSequentialSort = (rows) =>
  rows.map((item, index) => ({
    ...item,
    sort_order: index
  }));
const titleOf = (moduleKey, item) => {
  const config = moduleByKey[moduleKey];
  if (!config) return item?.id || '未命名';
  return item?.[config.titleField] || item?.title || item?.name || item?.slug || item?.id || '未命名';
};

const createEmptyRecord = (moduleKey) => {
  const config = moduleByKey[moduleKey];
  const slugPrefix = moduleKey.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  const now = new Date().toISOString();
  const base = {
    id: '',
    slug: `${slugPrefix}-${Date.now()}`,
    status: 'draft',
    title: '',
    summary: '',
    content: [],
    sort_order: 0,
    updated_at: now,
    created_at: now,
    published_at: null
  };

  if (config?.titleField && config.titleField !== 'title') base[config.titleField] = '';
  if (config?.summaryField && config.summaryField !== 'summary') base[config.summaryField] = '';
  if (config?.dateField) base[config.dateField] = '';
  if (config?.imageField) base[config.imageField] = '';
  if (config?.contentField && config.contentField !== 'content') {
    base[config.contentField] = [];
  }
  if (Array.isArray(config?.extraFields)) {
    config.extraFields.forEach((field) => {
      if (!field?.key) return;
      base[field.key] = '';
    });
  }
  if (moduleKey === 'trainingTracks') {
    base.name = '';
    base.positioning = '';
    base.hero = { title: '', subtitle: '' };
    base.audience = [];
    base.jobRoles = [];
    base.courseSlugs = [];
    base.homeCategory = '母婴';
    base.sort_order = 0;
  }
  if (moduleKey === 'trainingCourses') {
    base.name = '';
    base.trackSlug = '';
    base.summary = '';
    base.audience = '';
    base.durationTag = '';
    base.hasPractical = true;
    base.hasCertificate = true;
    base.hours = '';
    base.mode = '';
    base.certificate = '';
    base.priceNote = '';
    base.introParagraphs = [];
    base.examTarget = '';
    base.curriculumNote = '';
    base.registrationNotice = [];
    base.employmentDirections = [];
    base.trainingTime = '';
    base.trainingLocation = '';
    base.contactInfo = { phone: '', address: '' };
    base.certificateImage = '';
    base.certificateImageAlt = '';
    base.isFeatured = false;
    base.sort_order = 0;
  }
  if (moduleKey === 'promoCategories') {
    base.name = '';
    base.slug = `promo-category-${Date.now()}`;
    base.sceneLabel = '';
    base.positioning = '';
    base.hero = { title: '', subtitle: '' };
    base.highlights = [];
    base.sort_order = 0;
  }
  if (moduleKey === 'promoServices') {
    base.title = '';
    base.slug = `promo-service-${Date.now()}`;
    base.categorySlug = '';
    base.subtitle = '';
    base.summary = '';
    base.audience = [];
    base.audienceTags = [];
    base.process = [];
    base.deliveryCycle = '';
    base.regions = [];
    base.priceRange = '';
    base.priceFactors = [];
    base.capabilities = [];
    base.certifications = [];
    base.faq = [];
    base.contact = { phone: '', wechat: '', address: '' };
    base.coverImage = '';
    base.riskNotice = '';
    base.complianceNotice = '';
    base.sort_order = 0;
  }
  if (moduleKey === 'associationTeamStructure') {
    const roleKey = `team-role-${Date.now()}`;
    base.slug = roleKey;
    base.roleKey = roleKey;
    base.roleTitle = '';
    base.title = '';
    base.members = [];
    base.sort_order = 0;
  }
  if (moduleKey === 'topicVideos') {
    base.slug = `topic-video-${Date.now()}`;
    base.status = 'published';
    base.title = '';
    base.summary = '';
    base.pageIntro = '';
    base.duration = '';
    base.cardType = 'image_link';
    base.coverImage = '';
    base.playUrl = '';
    base.actionUrl = '';
    base.linkDomain = '';
    base.topic = '';
    base.tags = [];
    base.isFeatured = false;
    base.isPinned = false;
    base.sort_order = 0;
  }
  if (moduleKey === 'workstationGallery') {
    base.slug = `workstation-photo-${Date.now()}`;
    base.status = 'published';
    base.title = '';
    base.image = '';
    base.sort_order = 0;
  }
  return base;
};

const pickSimpleField = (record, key, fallback = '') => {
  const value = record?.[key];
  return typeof value === 'string' ? value : fallback;
};

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1600;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const width = Math.round(img.width * ratio);
        const height = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({ dataUrl, fileName: file.name, size: file.size });
      };
      img.onerror = reject;
      img.src = String(reader.result || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const exportLeadsCsv = (rows) => {
  const headers = ['id', 'leadType', 'project', 'serviceSlug', 'name', 'phone', 'city', 'message', 'followStatus', 'createdAt'];
  const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((key) => quote(row[key])).join(','));
  });
  const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminApp = () => {
  const [tokenChecked, setTokenChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ email: 'wangyan', password: 'wangyan1234' });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [moduleStats, setModuleStats] = useState([]);
  const [logs, setLogs] = useState([]);

  const [currentModule, setCurrentModule] = useState('focusNews');
  const [contentPage, setContentPage] = useState('partition');
  const [activeContentGroup, setActiveContentGroup] = useState(contentGroups[0]?.title || '');
  const [contentPartitionFilter, setContentPartitionFilter] = useState('all');
  const [listState, setListState] = useState({ items: [], total: 0, page: 1, pageSize: 20 });
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trainingTrackFilter, setTrainingTrackFilter] = useState('all');
  const [promoCategoryFilter, setPromoCategoryFilter] = useState('all');
  const [topicVideoTopicFilter, setTopicVideoTopicFilter] = useState('');
  const [topicVideoTagFilter, setTopicVideoTagFilter] = useState('');
  const [topicVideoCardTypeFilter, setTopicVideoCardTypeFilter] = useState('all');
  const [adminUi, setAdminUi] = useState(loadAdminUi);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [batchDeleting, setBatchDeleting] = useState(false);
  const [draggingRowId, setDraggingRowId] = useState('');
  const [draggingMemberId, setDraggingMemberId] = useState('');
  const [draggingMaternalArticleSlug, setDraggingMaternalArticleSlug] = useState('');
  const [moduleDropTarget, setModuleDropTarget] = useState(null);
  const [memberDropTarget, setMemberDropTarget] = useState(null);
  const [maternalArticleDropTarget, setMaternalArticleDropTarget] = useState(null);
  const [reordering, setReordering] = useState(false);

  const [editing, setEditing] = useState(null);
  const [editingRaw, setEditingRaw] = useState('');
  const [rawMode, setRawMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [maternalSubSlug, setMaternalSubSlug] = useState('');
  const [maternalArticleSlug, setMaternalArticleSlug] = useState('');
  const [trainingTrackOptions, setTrainingTrackOptions] = useState([]);
  const [trainingCourseRows, setTrainingCourseRows] = useState([]);
  const [promoCategoryOptions, setPromoCategoryOptions] = useState([]);
  const [promoServiceRows, setPromoServiceRows] = useState([]);

  const [mediaItems, setMediaItems] = useState([]);
  const [mediaRefs, setMediaRefs] = useState([]);
  const [mediaFolderFilter, setMediaFolderFilter] = useState('all');
  const [batchUploadingWorkstation, setBatchUploadingWorkstation] = useState(false);

  const [leads, setLeads] = useState([]);
  const [leadFilter, setLeadFilter] = useState({ type: '', status: '', q: '' });
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [batchDeletingLeads, setBatchDeletingLeads] = useState(false);
  const moduleStatsMap = useMemo(
    () => Object.fromEntries((moduleStats || []).map((item) => [item.key, item])),
    [moduleStats]
  );
  const mediaFolders = useMemo(() => {
    const set = new Set((mediaItems || []).map((item) => item.folder || item.moduleKey || 'media-library'));
    return ['all', ...Array.from(set)];
  }, [mediaItems]);
  const filteredMediaItems = useMemo(() => {
    if (mediaFolderFilter === 'all') return mediaItems;
    return (mediaItems || []).filter((item) => (item.folder || item.moduleKey || 'media-library') === mediaFolderFilter);
  }, [mediaItems, mediaFolderFilter]);
  const leadIdSet = useMemo(
    () => new Set((leads || []).map((item) => String(item?.id || '')).filter(Boolean)),
    [leads]
  );
  const selectedVisibleLeadIds = useMemo(
    () => selectedLeadIds.filter((id) => leadIdSet.has(id)),
    [selectedLeadIds, leadIdSet]
  );
  const allVisibleLeadsSelected = leads.length > 0 && selectedVisibleLeadIds.length === leads.length;
  const isNightMode = adminUi.mode === 'night';
  const adminBgColor = isNightMode ? '#0F172A' : '#F7F7FA';
  const adminTextColor = isNightMode ? '#E5E7EB' : '#1F2937';
  const adminPanelBorderColor = isNightMode ? '#334155' : '#E8D8DD';
  const adminPanelBgColor = isNightMode ? '#111827' : '#FFFFFF';

  const draftKey = useMemo(() => {
    if (!editing) return '';
    return `nocode_admin_draft_${currentModule}_${editing.id || 'new'}`;
  }, [currentModule, editing]);

  const refreshStats = async () => {
    const [statsData, logsData] = await Promise.all([adminApi.getModules(), adminApi.listLogs()]);
    setModuleStats(statsData);
    setLogs(logsData || []);
  };

  const ensureBootstrap = async () => {
    const result = await adminApi.bootstrapNeeded();
    if (!result?.needed) return;
    await adminApi.bootstrap(buildStaticSeedModules(), false);
  };

  const listAllContent = async (moduleKey) => {
    const pageSize = 200;
    let page = 1;
    let all = [];
    while (true) {
      const result = await adminApi.listContent(moduleKey, {
        page,
        pageSize,
        status: 'all'
      });
      const items = Array.isArray(result?.items) ? result.items : [];
      all = all.concat(items);
      const total = Number(result?.total || all.length);
      if (items.length === 0 || all.length >= total) break;
      page += 1;
    }
    return all;
  };

  const refreshList = async (moduleKey = currentModule, page = listState.page) => {
    const extraFilters = moduleKey === 'topicVideos'
      ? {
          topic: topicVideoTopicFilter,
          tag: topicVideoTagFilter,
          cardType: topicVideoCardTypeFilter === 'all' ? '' : topicVideoCardTypeFilter
        }
      : {};
    const result = await adminApi.listContent(moduleKey, {
      page,
      pageSize: listState.pageSize,
      q: query,
      status: statusFilter,
      ...extraFilters
    });
    setListState(result);
  };

  const refreshMedia = async () => {
    const rows = await adminApi.listMedia();
    setMediaItems(rows || []);
  };

  const refreshLeads = async () => {
    const rows = await adminApi.listLeads(leadFilter);
    setLeads(rows || []);
  };

  const checkToken = async () => {
    const token = getAdminToken();
    if (!token) {
      setTokenChecked(true);
      return;
    }
    try {
      const me = await adminApi.me();
      setUser(me);
      await ensureBootstrap();
      await Promise.all([refreshStats(), refreshList('focusNews', 1)]);
    } catch {
      clearAdminToken();
      setUser(null);
    } finally {
      setTokenChecked(true);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (!editing || !draftKey) return;
    const timer = setInterval(() => {
      localStorage.setItem(draftKey, JSON.stringify(editing));
    }, 10000);
    return () => clearInterval(timer);
  }, [editing, draftKey]);

  useEffect(() => {
    if (!user || activeMenu !== 'content' || contentPage !== 'editor') return;
    refreshList(currentModule, 1).catch(() => {});
  }, [
    currentModule,
    statusFilter,
    topicVideoTopicFilter,
    topicVideoTagFilter,
    topicVideoCardTypeFilter,
    contentPage,
    activeMenu,
    user
  ]);

  useEffect(() => {
    if (currentModule === 'trainingCourses') return;
    if (trainingTrackFilter !== 'all') setTrainingTrackFilter('all');
  }, [currentModule, trainingTrackFilter]);

  useEffect(() => {
    if (currentModule === 'promoServices') return;
    if (promoCategoryFilter !== 'all') setPromoCategoryFilter('all');
  }, [currentModule, promoCategoryFilter]);

  useEffect(() => {
    if (currentModule === 'topicVideos') return;
    if (topicVideoTopicFilter) setTopicVideoTopicFilter('');
    if (topicVideoTagFilter) setTopicVideoTagFilter('');
    if (topicVideoCardTypeFilter !== 'all') setTopicVideoCardTypeFilter('all');
  }, [currentModule, topicVideoTopicFilter, topicVideoTagFilter, topicVideoCardTypeFilter]);

  useEffect(() => {
    if (!user) return;
    if (activeMenu === 'media') refreshMedia().catch(() => {});
    if (activeMenu === 'leads') refreshLeads().catch(() => {});
    if (activeMenu === 'dashboard') refreshStats().catch(() => {});
  }, [activeMenu, user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nocode_admin_ui', JSON.stringify(adminUi));
  }, [adminUi]);

  useEffect(() => {
    if (currentModule !== 'maternalTopics' || !editing) return;
    const subcategories = Array.isArray(editing.subcategories) ? editing.subcategories : [];
    if (subcategories.length === 0) {
      if (maternalSubSlug) setMaternalSubSlug('');
      if (maternalArticleSlug) setMaternalArticleSlug('');
      return;
    }
    const nextSubSlug = subcategories.some((item) => item.slug === maternalSubSlug)
      ? maternalSubSlug
      : subcategories[0].slug;
    if (nextSubSlug !== maternalSubSlug) {
      setMaternalSubSlug(nextSubSlug);
      return;
    }
    const sub = subcategories.find((item) => item.slug === nextSubSlug);
    const articles = Array.isArray(sub?.articles) ? sub.articles : [];
    const nextArticleSlug = articles.some((item) => item.slug === maternalArticleSlug)
      ? maternalArticleSlug
      : '';
    if (nextArticleSlug !== maternalArticleSlug) {
      setMaternalArticleSlug(nextArticleSlug);
    }
  }, [currentModule, editing, maternalSubSlug, maternalArticleSlug]);

  useEffect(() => {
    if (!user || activeMenu !== 'content' || contentPage !== 'editor') return;
    if (!['trainingTracks', 'trainingCourses'].includes(currentModule)) return;
    let cancelled = false;
    const loadTrainingOptions = async () => {
      try {
        const [trackRows, courseRows] = await Promise.all([
          listAllContent('trainingTracks'),
          listAllContent('trainingCourses')
        ]);
        if (cancelled) return;
        const sortedTracks = [...trackRows].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
        const sortedCourses = [...courseRows].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
        setTrainingTrackOptions(sortedTracks);
        setTrainingCourseRows(sortedCourses);
      } catch {
        if (cancelled) return;
        setTrainingTrackOptions([]);
        setTrainingCourseRows([]);
      }
    };
    loadTrainingOptions();
    return () => {
      cancelled = true;
    };
  }, [user, activeMenu, contentPage, currentModule]);

  useEffect(() => {
    if (!user || activeMenu !== 'content' || contentPage !== 'editor') return;
    if (!['promoCategories', 'promoServices'].includes(currentModule)) return;
    let cancelled = false;
    const loadPromoOptions = async () => {
      try {
        const [categoryRows, serviceRows] = await Promise.all([
          listAllContent('promoCategories'),
          listAllContent('promoServices')
        ]);
        if (cancelled) return;
        const sortedCategories = [...categoryRows].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
        const sortedServices = [...serviceRows].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
        setPromoCategoryOptions(sortedCategories);
        setPromoServiceRows(sortedServices);
      } catch {
        if (cancelled) return;
        setPromoCategoryOptions([]);
        setPromoServiceRows([]);
      }
    };
    loadPromoOptions();
    return () => {
      cancelled = true;
    };
  }, [user, activeMenu, contentPage, currentModule]);

  const onLogin = async (event) => {
    event.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const result = await adminApi.login(authForm.email, authForm.password);
      setAdminToken(result.token);
      setUser(result.user);
      await ensureBootstrap();
      await Promise.all([refreshStats(), refreshList('focusNews', 1)]);
    } catch (error) {
      setAuthError(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    clearAdminToken();
    setUser(null);
    setEditing(null);
    setEditingRaw('');
  };

  const onCreate = () => {
    const empty = createEmptyRecord(currentModule);
    const cached = localStorage.getItem(`nocode_admin_draft_${currentModule}_new`);
    if (cached) {
      try {
        setEditing(JSON.parse(cached));
      } catch {
        setEditing(empty);
      }
    } else {
      setEditing(empty);
    }
    setEditingRaw(JSON.stringify(empty, null, 2));
    setRawMode(['maternalTopics', 'products', 'trainingTracks', 'trainingCourses', 'promoCategories', 'promoServices', 'associationTeamStructure', 'topicVideos'].includes(currentModule) ? false : !moduleByKey[currentModule]?.simple);
  };

  const onEdit = async (row) => {
    const detail = await adminApi.getContent(currentModule, row.id);
    const cache = localStorage.getItem(`nocode_admin_draft_${currentModule}_${row.id}`);
    let next = detail;
    if (cache) {
      try {
        next = JSON.parse(cache);
      } catch {
        next = detail;
      }
    }
    setEditing(next);
    setEditingRaw(JSON.stringify(next, null, 2));
    setRawMode(['maternalTopics', 'products', 'trainingTracks', 'trainingCourses', 'promoCategories', 'promoServices', 'associationTeamStructure', 'topicVideos'].includes(currentModule) ? false : !moduleByKey[currentModule]?.simple);
  };

  const updateEditing = (updater) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setEditingRaw(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const updateMaternalArticle = (updater) => {
    updateEditing((prev) => {
      if (!prev) return prev;
      const subcategories = Array.isArray(prev.subcategories) ? [...prev.subcategories] : [];
      const subIndex = subcategories.findIndex((item) => item.slug === maternalSubSlug);
      if (subIndex < 0) return prev;
      const sub = { ...subcategories[subIndex] };
      const articles = Array.isArray(sub.articles) ? [...sub.articles] : [];
      const articleIndex = articles.findIndex((item) => item.slug === maternalArticleSlug);
      if (articleIndex < 0) return prev;
      const currentArticle = articles[articleIndex] || {};
      const nextArticle = typeof updater === 'function' ? updater(currentArticle) : { ...currentArticle, ...updater };
      articles[articleIndex] = {
        ...nextArticle,
        updated_at: new Date().toISOString()
      };
      sub.articles = articles;
      subcategories[subIndex] = sub;
      return { ...prev, subcategories };
    });
  };

  const updateMaternalArticleBySlug = (articleSlug, updater) => {
    updateEditing((prev) => {
      if (!prev || !articleSlug) return prev;
      const subcategories = Array.isArray(prev.subcategories) ? [...prev.subcategories] : [];
      const subIndex = subcategories.findIndex((item) => item.slug === maternalSubSlug);
      if (subIndex < 0) return prev;
      const sub = { ...subcategories[subIndex] };
      const articles = Array.isArray(sub.articles) ? [...sub.articles] : [];
      const articleIndex = articles.findIndex((item) => item.slug === articleSlug);
      if (articleIndex < 0) return prev;
      const currentArticle = articles[articleIndex] || {};
      const nextArticleBase = typeof updater === 'function'
        ? updater(currentArticle)
        : { ...currentArticle, ...updater };
      articles[articleIndex] = {
        ...nextArticleBase,
        updated_at: new Date().toISOString()
      };
      sub.articles = articles;
      subcategories[subIndex] = sub;
      return { ...prev, subcategories };
    });
  };

  const deleteMaternalArticleBySlug = (articleSlug) => {
    updateEditing((prev) => {
      if (!prev || !articleSlug) return prev;
      const subcategories = Array.isArray(prev.subcategories) ? [...prev.subcategories] : [];
      const subIndex = subcategories.findIndex((item) => item.slug === maternalSubSlug);
      if (subIndex < 0) return prev;
      const sub = { ...subcategories[subIndex] };
      const articles = Array.isArray(sub.articles) ? [...sub.articles] : [];
      sub.articles = articles.filter((item) => item.slug !== articleSlug);
      subcategories[subIndex] = sub;
      return { ...prev, subcategories };
    });
  };

  const buildUpdatedMaternalEditingBySlug = (source, articleSlug, updater) => {
    if (!source || !articleSlug) return null;
    const targetSubSlug = maternalSubSlug || (Array.isArray(source.subcategories) ? source.subcategories[0]?.slug : '');
    if (!targetSubSlug) return null;
    const subcategories = Array.isArray(source.subcategories) ? [...source.subcategories] : [];
    const subIndex = subcategories.findIndex((item) => item.slug === targetSubSlug);
    if (subIndex < 0) return null;
    const sub = { ...subcategories[subIndex] };
    const articles = Array.isArray(sub.articles) ? [...sub.articles] : [];
    const articleIndex = articles.findIndex((item) => item.slug === articleSlug);
    if (articleIndex < 0) return null;
    const currentArticle = articles[articleIndex] || {};
    const nextArticleBase = typeof updater === 'function'
      ? updater(currentArticle)
      : { ...currentArticle, ...updater };
    articles[articleIndex] = {
      ...nextArticleBase,
      updated_at: new Date().toISOString()
    };
    sub.articles = articles;
    subcategories[subIndex] = sub;
    return { ...source, subcategories };
  };

  const buildDeletedMaternalEditingBySlug = (source, articleSlug) => {
    if (!source || !articleSlug) return null;
    const targetSubSlug = maternalSubSlug || (Array.isArray(source.subcategories) ? source.subcategories[0]?.slug : '');
    if (!targetSubSlug) return null;
    const subcategories = Array.isArray(source.subcategories) ? [...source.subcategories] : [];
    const subIndex = subcategories.findIndex((item) => item.slug === targetSubSlug);
    if (subIndex < 0) return null;
    const sub = { ...subcategories[subIndex] };
    const articles = Array.isArray(sub.articles) ? [...sub.articles] : [];
    sub.articles = articles.filter((item) => item.slug !== articleSlug);
    subcategories[subIndex] = sub;
    return { ...source, subcategories };
  };

  const saveMaternalEditingInstant = async (nextEditing) => {
    if (!nextEditing) return false;
    setSaving(true);
    try {
      let saved = nextEditing;
      if (saved.id) {
        await adminApi.updateContent(currentModule, saved.id, saved);
      } else {
        saved = await adminApi.createContent(currentModule, saved);
      }
      setEditing(saved);
      setEditingRaw(JSON.stringify(saved, null, 2));
      if (draftKey) localStorage.removeItem(draftKey);
      await Promise.all([refreshList(currentModule, listState.page), refreshStats()]);
      return true;
    } catch (error) {
      alert(error.message || '自动保存失败');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleMaternalArticlePublishAndSave = async (articleSlug) => {
    if (!editing || !articleSlug) return;
    const previous = editing;
    const next = buildUpdatedMaternalEditingBySlug(previous, articleSlug, (prev) => ({
      ...prev,
      status: prev?.status === 'draft' ? 'published' : 'draft'
    }));
    if (!next) return;
    setEditing(next);
    setEditingRaw(JSON.stringify(next, null, 2));
    const ok = await saveMaternalEditingInstant(next);
    if (!ok) {
      setEditing(previous);
      setEditingRaw(JSON.stringify(previous, null, 2));
    }
  };

  const deleteMaternalArticleAndSave = async (articleSlug) => {
    if (!editing || !articleSlug) return;
    const previous = editing;
    const next = buildDeletedMaternalEditingBySlug(previous, articleSlug);
    if (!next) return;
    if (maternalArticleSlug === articleSlug) {
      setMaternalArticleSlug('');
    }
    setEditing(next);
    setEditingRaw(JSON.stringify(next, null, 2));
    const ok = await saveMaternalEditingInstant(next);
    if (!ok) {
      setEditing(previous);
      setEditingRaw(JSON.stringify(previous, null, 2));
    }
  };

  const addMaternalArticle = () => {
    const targetSubSlug = maternalSubSlug || (Array.isArray(editing?.subcategories) ? editing.subcategories[0]?.slug : '');
    if (!targetSubSlug) {
      alert('当前专题下没有可用方向，无法新增文章');
      return;
    }
    const timestamp = Date.now();
    const newSlug = `new-article-${timestamp}`;
    const nowIso = new Date().toISOString();
    updateEditing((prev) => {
      if (!prev) return prev;
      const subcategories = Array.isArray(prev.subcategories) ? [...prev.subcategories] : [];
      const subIndex = subcategories.findIndex((item) => item.slug === targetSubSlug);
      if (subIndex < 0) return prev;
      const sub = { ...subcategories[subIndex] };
      const articles = Array.isArray(sub.articles) ? [...sub.articles] : [];
      articles.push({
        slug: newSlug,
        title: '新文章',
        author: '关爱母婴健康网',
        publishedAt: nowIso.slice(0, 10),
        body: [],
        status: 'draft',
        sort_order: articles.length,
        updated_at: nowIso
      });
      sub.articles = articles;
      subcategories[subIndex] = sub;
      return { ...prev, subcategories };
    });
    setMaternalSubSlug(targetSubSlug);
    setMaternalArticleSlug(newSlug);
  };

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      let payload = editing;
      if (rawMode) {
        payload = JSON.parse(editingRaw);
      }

      if (currentModule === 'homeHeroSlides') {
        const parsedSort = Number(payload.sort_order ?? 0);
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        payload = {
          ...payload,
          sort_order: Math.floor(parsedSort),
          status: 'draft'
        };
      }

      if (!payload.slug) {
        if (currentModule === 'homeHeroSlides') {
          payload = { ...payload, slug: `home-hero-slide-${Date.now()}` };
        } else {
          throw new Error('slug 不能为空');
        }
      }

      if (['focusNews', 'associationNotices', 'internationalProjects'].includes(currentModule)) {
        const dateValue = String(payload?.date || '').trim();
        if (!dateValue) {
          throw new Error('日期不能为空');
        }
      }

      if (['healthLecturesUpcoming', 'healthLecturesReplay'].includes(currentModule)) {
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        payload = {
          ...payload,
          sort_order: Math.floor(parsedSort)
        };
      }

      if (currentModule === 'expertVoices') {
        const nameValue = String(payload?.name || '').trim();
        const titleValue = String(payload?.title || '').trim();
        if (!nameValue) {
          throw new Error('人物姓名不能为空');
        }
        if (!titleValue) {
          throw new Error('身份职务不能为空');
        }
        const topicsRaw = typeof payload?.topics_input === 'string'
          ? payload.topics_input
          : (Array.isArray(payload?.topics) ? payload.topics.join('、') : String(payload?.topics || ''));
        const normalizedTopics = Array.isArray(payload?.topics)
          ? payload.topics.map((item) => String(item || '').trim()).filter(Boolean)
          : parseTags(topicsRaw);
        const quoteValue = String(payload?.quote || '').trim();
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        payload = {
          ...payload,
          name: nameValue,
          title: titleValue,
          institution: String(payload?.institution || '').trim(),
          sort_order: Math.floor(parsedSort),
          topics: normalizedTopics,
          intro: String(payload?.intro || quoteValue).trim()
        };
        delete payload.topics_input;
      }

      if (currentModule === 'products') {
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        payload = {
          ...payload,
          sort_order: Math.floor(parsedSort)
        };
      }

      if (currentModule === 'trainingTracks') {
        const nameValue = String(payload?.name || '').trim();
        const slugValue = String(payload?.slug || '').trim();
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!nameValue) throw new Error('方向名称不能为空');
        if (!slugValue) throw new Error('方向标识 slug 不能为空');
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        const allTracks = await listAllContent('trainingTracks');
        const duplicated = allTracks.find((item) => item.slug === slugValue && item.id !== payload.id);
        if (duplicated) throw new Error('方向 slug 已存在，请更换');
        const allCourses = await listAllContent('trainingCourses');
        const linkedCourseSlugs = allCourses
          .filter((item) => String(item?.trackSlug || '') === slugValue)
          .sort((a, b) => Number(a?.sort_order || 0) - Number(b?.sort_order || 0))
          .map((item) => String(item.slug || '').trim())
          .filter(Boolean);
        const normalizedHomeCategory = trainingHomeCategoryOptions.includes(payload?.homeCategory)
          ? payload.homeCategory
          : '其他';
        payload = {
          ...payload,
          name: nameValue,
          slug: slugValue,
          sort_order: Math.floor(parsedSort),
          positioning: String(payload?.positioning || '').trim(),
          hero: {
            title: String(payload?.hero?.title || '').trim(),
            subtitle: String(payload?.hero?.subtitle || '').trim()
          },
          audience: Array.isArray(payload?.audience) ? payload.audience.map((item) => String(item || '').trim()).filter(Boolean) : [],
          jobRoles: Array.isArray(payload?.jobRoles) ? payload.jobRoles.map((item) => String(item || '').trim()).filter(Boolean) : [],
          homeCategory: normalizedHomeCategory,
          courseSlugs: linkedCourseSlugs
        };
      }

      if (currentModule === 'trainingCourses') {
        const nameValue = String(payload?.name || '').trim();
        const slugValue = String(payload?.slug || '').trim();
        const trackSlugValue = String(payload?.trackSlug || '').trim();
        const summaryValue = String(payload?.summary || '').trim();
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!nameValue) throw new Error('课程名称不能为空');
        if (!slugValue) throw new Error('课程标识 slug 不能为空');
        if (!trackSlugValue) throw new Error('所属方向不能为空');
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        const [allCourses, allTracks] = await Promise.all([
          listAllContent('trainingCourses'),
          listAllContent('trainingTracks')
        ]);
        const duplicated = allCourses.find((item) => item.slug === slugValue && item.id !== payload.id);
        if (duplicated) throw new Error('课程 slug 已存在，请更换');
        const validTrack = allTracks.some((item) => String(item.slug || '') === trackSlugValue);
        if (!validTrack) throw new Error('所属方向不存在，请先创建或选择有效方向');
        if ((payload.status || 'draft') === 'published' && !summaryValue) {
          throw new Error('发布状态下课程简介不能为空');
        }
        const normalizedDurationTag = trainingDurationOptions.includes(String(payload?.durationTag || '').trim())
          ? String(payload.durationTag).trim()
          : trainingDurationOptions[0];
        payload = {
          ...payload,
          name: nameValue,
          slug: slugValue,
          trackSlug: trackSlugValue,
          sort_order: Math.floor(parsedSort),
          summary: summaryValue,
          isFeatured: Boolean(payload?.isFeatured),
          audience: String(payload?.audience || '').trim(),
          durationTag: normalizedDurationTag,
          hasPractical: Boolean(payload?.hasPractical),
          hasCertificate: Boolean(payload?.hasCertificate),
          hours: String(payload?.hours || '').trim(),
          mode: String(payload?.mode || '').trim(),
          certificate: String(payload?.certificate || '').trim(),
          priceNote: String(payload?.priceNote || '').trim(),
          introParagraphs: Array.isArray(payload?.introParagraphs) ? payload.introParagraphs.map((item) => String(item || '').trim()).filter(Boolean) : [],
          examTarget: String(payload?.examTarget || '').trim(),
          curriculumNote: String(payload?.curriculumNote || '').trim(),
          registrationNotice: Array.isArray(payload?.registrationNotice) ? payload.registrationNotice.map((item) => String(item || '').trim()).filter(Boolean) : [],
          employmentDirections: Array.isArray(payload?.employmentDirections) ? payload.employmentDirections.map((item) => String(item || '').trim()).filter(Boolean) : [],
          trainingTime: String(payload?.trainingTime || '').trim(),
          trainingLocation: String(payload?.trainingLocation || '').trim(),
          contactInfo: {
            phone: String(payload?.contactInfo?.phone || '').trim(),
            address: String(payload?.contactInfo?.address || '').trim()
          },
          certificateImage: String(payload?.certificateImage || '').trim(),
          certificateImageAlt: String(payload?.certificateImageAlt || '').trim()
        };
      }

      if (currentModule === 'promoCategories') {
        const nameValue = String(payload?.name || '').trim();
        const slugValue = String(payload?.slug || '').trim();
        const sceneLabelValue = String(payload?.sceneLabel || '').trim();
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!nameValue) throw new Error('分类名称不能为空');
        if (!slugValue) throw new Error('分类 slug 不能为空');
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        const allCategories = await listAllContent('promoCategories');
        const duplicated = allCategories.find((item) => item.slug === slugValue && item.id !== payload.id);
        if (duplicated) throw new Error('分类 slug 已存在，请更换');
        payload = {
          ...payload,
          name: nameValue,
          slug: slugValue,
          sceneLabel: sceneLabelValue,
          sort_order: Math.floor(parsedSort),
          positioning: String(payload?.positioning || '').trim(),
          hero: {
            title: String(payload?.hero?.title || '').trim(),
            subtitle: String(payload?.hero?.subtitle || '').trim()
          },
          highlights: Array.isArray(payload?.highlights) ? payload.highlights.map((item) => String(item || '').trim()).filter(Boolean) : []
        };
      }

      if (currentModule === 'promoServices') {
        const titleValue = String(payload?.title || '').trim();
        const slugValue = String(payload?.slug || '').trim();
        const categorySlugValue = String(payload?.categorySlug || '').trim();
        const summaryValue = String(payload?.summary || '').trim();
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!titleValue) throw new Error('服务标题不能为空');
        if (!slugValue) throw new Error('服务 slug 不能为空');
        if (!categorySlugValue) throw new Error('所属分类不能为空');
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        const [allServices, allCategories] = await Promise.all([
          listAllContent('promoServices'),
          listAllContent('promoCategories')
        ]);
        const duplicated = allServices.find((item) => item.slug === slugValue && item.id !== payload.id);
        if (duplicated) throw new Error('服务 slug 已存在，请更换');
        const validCategory = allCategories.some((item) => String(item.slug || '') === categorySlugValue);
        if (!validCategory) throw new Error('所属分类不存在，请先创建或选择有效分类');
        if ((payload.status || 'draft') === 'published' && !summaryValue) {
          throw new Error('发布状态下服务摘要不能为空');
        }
        payload = {
          ...payload,
          title: titleValue,
          slug: slugValue,
          categorySlug: categorySlugValue,
          sort_order: Math.floor(parsedSort),
          subtitle: String(payload?.subtitle || '').trim(),
          summary: summaryValue,
          audience: Array.isArray(payload?.audience) ? payload.audience.map((item) => String(item || '').trim()).filter(Boolean) : [],
          audienceTags: Array.isArray(payload?.audienceTags) ? payload.audienceTags.map((item) => String(item || '').trim()).filter(Boolean) : [],
          process: Array.isArray(payload?.process) ? payload.process.map((item) => String(item || '').trim()).filter(Boolean) : [],
          deliveryCycle: String(payload?.deliveryCycle || '').trim(),
          regions: Array.isArray(payload?.regions) ? payload.regions.map((item) => String(item || '').trim()).filter(Boolean) : [],
          priceRange: String(payload?.priceRange || '').trim(),
          priceFactors: Array.isArray(payload?.priceFactors) ? payload.priceFactors.map((item) => String(item || '').trim()).filter(Boolean) : [],
          capabilities: Array.isArray(payload?.capabilities) ? payload.capabilities.map((item) => String(item || '').trim()).filter(Boolean) : [],
          certifications: Array.isArray(payload?.certifications) ? payload.certifications.map((item) => String(item || '').trim()).filter(Boolean) : [],
          faq: Array.isArray(payload?.faq)
            ? payload.faq.map((item) => ({ q: String(item?.q || '').trim(), a: String(item?.a || '').trim() })).filter((item) => item.q || item.a)
            : [],
          contact: {
            phone: String(payload?.contact?.phone || '').trim(),
            wechat: String(payload?.contact?.wechat || '').trim(),
            address: String(payload?.contact?.address || '').trim()
          },
          coverImage: String(payload?.coverImage || '').trim(),
          riskNotice: String(payload?.riskNotice || '').trim(),
          complianceNotice: String(payload?.complianceNotice || '').trim()
        };
      }

      if (currentModule === 'topicVideos') {
        const slugValue = String(payload?.slug || '').trim();
        const titleValue = String(payload?.title || '').trim();
        const cardTypeValue = String(payload?.cardType || 'image_link').trim();
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!slugValue) throw new Error('视频标识 slug 不能为空');
        if (!titleValue) throw new Error('视频标题不能为空');
        if (!['image_link', 'embedded_video'].includes(cardTypeValue)) {
          throw new Error('卡片类型仅支持 image_link 或 embedded_video');
        }
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        const playUrl = String(payload?.playUrl || '').trim();
        const actionUrl = String(payload?.actionUrl || '').trim();
        const coverImage = String(payload?.coverImage || '').trim();
        if (cardTypeValue === 'image_link') {
          if (!coverImage) throw new Error('图片卡片必须填写封面图');
          if (!actionUrl) throw new Error('图片卡片必须填写跳转链接');
        }
        if (cardTypeValue === 'embedded_video' && !playUrl) {
          throw new Error('视频卡片必须填写播放链接');
        }

        let resolvedDomain = '';
        if (playUrl) {
          const playCheck = await adminApi.validateTopicVideoLink(playUrl);
          if (!playCheck?.valid) {
            throw new Error(`播放链接不可用：${playCheck?.reason || '链接不合法'}`);
          }
          resolvedDomain = playCheck.domain || resolvedDomain;
        }
        if (actionUrl) {
          const actionCheck = await adminApi.validateTopicVideoLink(actionUrl);
          if (!actionCheck?.valid) {
            throw new Error(`跳转链接不可用：${actionCheck?.reason || '链接不合法'}`);
          }
          resolvedDomain = resolvedDomain || actionCheck.domain || '';
        }

        const tagsRaw = typeof payload?.tags_input === 'string'
          ? payload.tags_input
          : (Array.isArray(payload?.tags) ? payload.tags.join('、') : '');
        const normalizedTags = Array.isArray(payload?.tags)
          ? payload.tags.map((item) => String(item || '').trim()).filter(Boolean)
          : parseTags(tagsRaw);

        payload = {
          ...payload,
          slug: slugValue,
          title: titleValue,
          cardType: cardTypeValue,
          summary: String(payload?.summary || '').trim(),
          pageIntro: String(payload?.pageIntro || '').trim(),
          duration: String(payload?.duration || '').trim(),
          coverImage: cardTypeValue === 'image_link' ? coverImage : '',
          playUrl: cardTypeValue === 'embedded_video' ? playUrl : '',
          actionUrl: cardTypeValue === 'image_link' ? actionUrl : '',
          linkDomain: resolvedDomain,
          topic: String(payload?.topic || '').trim(),
          tags: normalizedTags,
          isPinned: Boolean(payload?.isPinned),
          isFeatured: Boolean(payload?.isFeatured),
          publishStartAt: '',
          publishEndAt: '',
          sort_order: Math.floor(parsedSort)
        };
        delete payload.tags_input;
      }

      if (currentModule === 'workstationGallery') {
        const slugValue = String(payload?.slug || '').trim();
        const imageValue = String(payload?.image || '').trim();
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!slugValue) throw new Error('图片标识 slug 不能为空');
        if (!imageValue) throw new Error('图片地址不能为空');
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        payload = {
          ...payload,
          slug: slugValue,
          title: String(payload?.title || '').trim(),
          image: imageValue,
          sort_order: Math.floor(parsedSort)
        };
      }

      if (currentModule === 'associationTeamStructure') {
        const roleKeyValue = String(payload?.roleKey || payload?.slug || '').trim();
        const roleTitleValue = String(payload?.roleTitle || payload?.title || '').trim();
        const parsedSort = Number(payload?.sort_order ?? 0);
        if (!roleKeyValue) throw new Error('职务标识不能为空');
        if (!/^[a-z0-9_-]+$/i.test(roleKeyValue)) {
          throw new Error('职务标识仅支持字母、数字、下划线或中划线。');
        }
        if (!roleTitleValue) throw new Error('职务名称不能为空');
        if (!Number.isFinite(parsedSort) || parsedSort < 0) {
          throw new Error('排序号必须是从 0 开始的正整数');
        }
        const allRoles = await listAllContent('associationTeamStructure');
        const duplicated = allRoles.find((item) => String(item?.roleKey || item?.slug || '') === roleKeyValue && item.id !== payload.id);
        if (duplicated) throw new Error('该职务标识已存在，请更换后再保存。');
        const members = Array.isArray(payload?.members)
          ? payload.members
            .map((member, index) => ({
              id: String(member?.id || `${roleKeyValue}-${index + 1}`).trim(),
              image: String(member?.image || '').trim(),
              caption: String(member?.caption || '').trim(),
              sort_order: Math.max(0, Number(member?.sort_order ?? index))
            }))
            .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
          : [];
        if ((payload.status || 'draft') === 'published') {
          const invalid = members.find((item) => !item.image || !item.caption);
          if (invalid) {
            throw new Error('发布状态下每个成员都必须填写图片和图片下文字。');
          }
        }
        payload = {
          ...payload,
          slug: roleKeyValue,
          roleKey: roleKeyValue,
          roleTitle: roleTitleValue,
          title: roleTitleValue,
          sort_order: Math.floor(parsedSort),
          members
        };
      }

      if (payload.id) {
        await adminApi.updateContent(currentModule, payload.id, payload);
      } else {
        await adminApi.createContent(currentModule, payload);
      }

      if (draftKey) localStorage.removeItem(draftKey);
      setEditing(null);
      setEditingRaw('');
      await Promise.all([refreshList(currentModule, listState.page), refreshStats()]);
      alert('保存成功');
    } catch (error) {
      alert(error.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (row) => {
    if (!window.confirm('确认删除该内容吗？')) return;
    const result = await deleteRowInternal(row, { refreshAfter: true });
    if (!result.ok && result.message) {
      alert(result.message);
      return;
    }
  };

  const deleteRowInternal = async (row, options = {}) => {
    const { refreshAfter = false } = options;
    if (!row?.id) return { ok: false, message: '无效内容，无法删除。' };
    if (currentModule === 'trainingTracks') {
      const linkedCourses = await listAllContent('trainingCourses');
      const existsLinked = linkedCourses.some((item) => String(item?.trackSlug || '') === String(row?.slug || ''));
      if (existsLinked) {
        return { ok: false, message: '该培训方向下仍有关联课程，请先处理课程后再删除方向。' };
      }
    }
    if (currentModule === 'promoCategories') {
      const linkedServices = await listAllContent('promoServices');
      const existsLinked = linkedServices.some((item) => String(item?.categorySlug || '') === String(row?.slug || ''));
      if (existsLinked) {
        return { ok: false, message: '该项目推广分类下仍有关联服务，请先处理服务后再删除分类。' };
      }
    }
    await adminApi.deleteContent(currentModule, row.id);
    if (refreshAfter) {
      await Promise.all([refreshList(currentModule, listState.page), refreshStats()]);
    }
    return { ok: true };
  };

  const toggleSelectRow = (rowId, checked) => {
    const id = String(rowId || '');
    if (!id) return;
    setSelectedRowIds((prev) => {
      const set = new Set(prev);
      if (checked) set.add(id);
      else set.delete(id);
      return Array.from(set);
    });
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = currentSelectableRows.map((item) => String(item?.id || '')).filter(Boolean);
    setSelectedRowIds((prev) => {
      const set = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => set.delete(id));
      } else {
        visibleIds.forEach((id) => set.add(id));
      }
      return Array.from(set);
    });
  };

  const onDeleteSelected = async () => {
    if (!selectedVisibleIds.length) return;
    if (!window.confirm(`确认删除已选中的 ${selectedVisibleIds.length} 条内容吗？`)) return;
    setBatchDeleting(true);
    try {
      const rowMap = new Map(
        currentSelectableRows
          .map((item) => [String(item?.id || ''), item])
          .filter(([id]) => Boolean(id))
      );
      const failed = [];
      for (const id of selectedVisibleIds) {
        const row = rowMap.get(id);
        if (!row) continue;
        const result = await deleteRowInternal(row, { refreshAfter: false });
        if (!result.ok) {
          failed.push(`${titleOf(currentModule, row)}：${result.message || '删除失败'}`);
        }
      }
      setSelectedRowIds((prev) => prev.filter((id) => !selectedVisibleIds.includes(id)));
      await Promise.all([refreshList(currentModule, listState.page), refreshStats()]);
      if (failed.length > 0) {
        alert(`部分删除失败：\n${failed.slice(0, 6).join('\n')}${failed.length > 6 ? `\n...共 ${failed.length} 条失败` : ''}`);
        return;
      }
    } finally {
      setBatchDeleting(false);
    }
  };

  const goToListPage = async (page) => {
    const target = Math.min(Math.max(1, Number(page || 1)), listTotalPages);
    if (target === currentListPage) return;
    await refreshList(currentModule, target);
    setSelectedRowIds([]);
  };

  const togglePublish = async (row) => {
    if (row.status === 'published') {
      await adminApi.unpublishContent(currentModule, row.id);
    } else {
      await adminApi.publishContent(currentModule, row.id);
    }
    await Promise.all([refreshList(currentModule, listState.page), refreshStats()]);
  };

  const onInlineImageUpload = async (fieldKey, files) => {
    const file = Array.from(files || [])[0];
    if (!file) return;
    try {
      const { dataUrl, fileName, size } = await compressImage(file);
      const uploaded = await adminApi.uploadMedia(fileName, dataUrl, size, currentModule);
      updateEditing((prev) => ({ ...prev, [fieldKey]: uploaded.url }));
      await refreshMedia();
    } catch (error) {
      alert(error.message || '上传失败，请重试');
    }
  };

  const onBatchUploadWorkstationPhotos = async (files) => {
    const allFiles = Array.from(files || []);
    if (!allFiles.length) return;
    if (allFiles.length > 10) {
      alert('一次最多上传 10 张图片');
      return;
    }
    setBatchUploadingWorkstation(true);
    try {
      const allRows = await listAllContent('workstationGallery');
      const maxSort = allRows.reduce((max, item) => Math.max(max, Number(item?.sort_order || 0)), -1);
      for (let index = 0; index < allFiles.length; index += 1) {
        const file = allFiles[index];
        const { dataUrl, fileName, size } = await compressImage(file);
        const uploaded = await adminApi.uploadMedia(fileName, dataUrl, size, 'workstationGallery');
        const baseName = String(file.name || `photo-${Date.now()}`)
          .replace(/\.[^/.]+$/, '')
          .trim();
        const slugBase = baseName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || `workstation-photo-${Date.now()}-${index + 1}`;
        const payload = {
          slug: `${slugBase}-${Date.now()}-${index + 1}`,
          title: baseName,
          image: uploaded.url,
          status: 'published',
          sort_order: maxSort + index + 1
        };
        await adminApi.createContent('workstationGallery', payload);
      }
      await Promise.all([refreshList(currentModule, 1), refreshStats(), refreshMedia()]);
      alert(`已上传 ${allFiles.length} 张图片`);
    } catch (error) {
      alert(error.message || '批量上传失败');
    } finally {
      setBatchUploadingWorkstation(false);
    }
  };

  const onCheckRefs = async (item) => {
    const refs = await adminApi.mediaReferences(item.id);
    setMediaRefs(refs || []);
  };

  const onDeleteMedia = async (item) => {
    if (!window.confirm('确认删除该图片吗？')) return;
    try {
      await adminApi.deleteMedia(item.id);
      await refreshMedia();
    } catch (error) {
      alert(error.message || '删除失败');
    }
  };

  const onUpdateLeadStatus = async (id, followStatus) => {
    await adminApi.updateLead(id, followStatus);
    await refreshLeads();
  };

  const toggleSelectLead = (leadId, checked) => {
    const id = String(leadId || '');
    if (!id) return;
    setSelectedLeadIds((prev) => {
      const set = new Set(prev);
      if (checked) set.add(id);
      else set.delete(id);
      return Array.from(set);
    });
  };

  const toggleSelectAllLeads = () => {
    const visibleIds = (leads || []).map((item) => String(item?.id || '')).filter(Boolean);
    setSelectedLeadIds((prev) => {
      const set = new Set(prev);
      if (allVisibleLeadsSelected) {
        visibleIds.forEach((id) => set.delete(id));
      } else {
        visibleIds.forEach((id) => set.add(id));
      }
      return Array.from(set);
    });
  };

  const onDeleteSelectedLeads = async () => {
    if (!selectedVisibleLeadIds.length) return;
    if (!window.confirm(`确认删除已选中的 ${selectedVisibleLeadIds.length} 条线索吗？`)) return;
    setBatchDeletingLeads(true);
    try {
      const failed = [];
      for (const id of selectedVisibleLeadIds) {
        try {
          await adminApi.deleteLead(id);
        } catch (error) {
          failed.push(`${id}: ${error?.message || '删除失败'}`);
        }
      }
      setSelectedLeadIds((prev) => prev.filter((id) => !selectedVisibleLeadIds.includes(id)));
      await Promise.all([refreshLeads(), refreshStats()]);
      if (failed.length > 0) {
        alert(`部分删除失败：\n${failed.slice(0, 6).join('\n')}${failed.length > 6 ? `\n...共 ${failed.length} 条失败` : ''}`);
      }
    } finally {
      setBatchDeletingLeads(false);
    }
  };

  const moduleVisibleByPartitionFilter = (stats) => {
    if (contentPartitionFilter === 'hasDraft') return Number(stats?.draft || 0) > 0;
    if (contentPartitionFilter === 'publishedEmpty') return Number(stats?.published || 0) === 0;
    return true;
  };

  const chooseContentModule = (moduleKey) => {
    setEditing(null);
    setEditingRaw('');
    setSelectedRowIds([]);
    setCurrentModule(moduleKey);
    if (moduleKey !== 'trainingCourses') setTrainingTrackFilter('all');
    if (moduleKey !== 'promoServices') setPromoCategoryFilter('all');
    if (moduleKey !== 'topicVideos') {
      setTopicVideoTopicFilter('');
      setTopicVideoTagFilter('');
      setTopicVideoCardTypeFilter('all');
    }
    setContentPage('editor');
  };

  const backToContentPartition = () => {
    setEditing(null);
    setEditingRaw('');
    setSelectedRowIds([]);
    setContentPage('partition');
  };

  const onMenuClick = (menuKey) => {
    setActiveMenu(menuKey);
    if (menuKey !== 'leads') setSelectedLeadIds([]);
    if (menuKey === 'content') {
      setContentPage('partition');
      setEditing(null);
      setEditingRaw('');
      setSelectedRowIds([]);
    }
  };

  if (!tokenChecked) {
    return <div className="min-h-screen flex items-center justify-center">后台加载中...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F5F7] flex items-center justify-center px-4">
        <form onSubmit={onLogin} className="w-full max-w-md rounded-2xl border border-[#E8D8DD] bg-white p-6">
          <h1 className="text-2xl font-bold text-[#1F2937]">网站后台登录</h1>
          <p className="mt-2 text-sm text-[#6B7280]">默认账号：wangyan / wangyan1234</p>
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={authForm.email}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="用户名"
              className="w-full rounded-lg border border-[#E5C0C8] px-3 py-2"
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="密码"
              className="w-full rounded-lg border border-[#E5C0C8] px-3 py-2"
            />
          </div>
          {authError ? <p className="mt-3 text-sm text-red-500">{authError}</p> : null}
          <button disabled={loading} className="mt-4 w-full rounded-lg bg-[#194F92] py-2 text-white disabled:opacity-60">
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    );
  }

  const currentModuleConfig = moduleByKey[currentModule];
  const isHomeHeroSlidesModule = currentModule === 'homeHeroSlides';
  const isHomeLatestTipsModule = currentModule === 'homeLatestTips';
  const isNewsLikeModule = ['focusNews', 'associationNotices', 'internationalProjects'].includes(currentModule);
  const isExpertVoicesModule = currentModule === 'expertVoices';
  const isHealthLectureModule = ['healthLecturesUpcoming', 'healthLecturesReplay'].includes(currentModule);
  const isMaternalTopicsModule = currentModule === 'maternalTopics';
  const isProductsModule = currentModule === 'products';
  const isTrainingTrackModule = currentModule === 'trainingTracks';
  const isTrainingCourseModule = currentModule === 'trainingCourses';
  const isTrainingModule = isTrainingTrackModule || isTrainingCourseModule;
  const isPromoCategoryModule = currentModule === 'promoCategories';
  const isPromoServiceModule = currentModule === 'promoServices';
  const isPromoModule = isPromoCategoryModule || isPromoServiceModule;
  const isAssociationTeamModule = currentModule === 'associationTeamStructure';
  const isTopicVideosModule = currentModule === 'topicVideos';
  const isWorkstationGalleryModule = currentModule === 'workstationGallery';
  const trainingTrackNameMap = Object.fromEntries(
    (trainingTrackOptions || []).map((track) => [String(track?.slug || ''), String(track?.name || track?.slug || '')])
  );
  const promoCategoryNameMap = Object.fromEntries(
    (promoCategoryOptions || []).map((category) => [String(category?.slug || ''), String(category?.name || category?.slug || '')])
  );
  const visibleEditorRows = (() => {
    const rows = Array.isArray(listState.items) ? listState.items : [];
    let filtered = rows;
    if (isTrainingCourseModule && trainingTrackFilter !== 'all') {
      filtered = filtered.filter((row) => String(row?.trackSlug || '') === trainingTrackFilter);
    }
    if (isPromoServiceModule && promoCategoryFilter !== 'all') {
      filtered = filtered.filter((row) => String(row?.categorySlug || '') === promoCategoryFilter);
    }
    if (isTopicVideosModule && topicVideoTopicFilter.trim()) {
      const q = topicVideoTopicFilter.trim().toLowerCase();
      filtered = filtered.filter((row) => String(row?.topic || '').toLowerCase().includes(q));
    }
    if (isTopicVideosModule && topicVideoTagFilter.trim()) {
      const q = topicVideoTagFilter.trim().toLowerCase();
      filtered = filtered.filter((row) => Array.isArray(row?.tags) && row.tags.some((item) => String(item || '').toLowerCase().includes(q)));
    }
    if (isTopicVideosModule && topicVideoCardTypeFilter !== 'all') {
      filtered = filtered.filter((row) => String(row?.cardType || '') === topicVideoCardTypeFilter);
    }
    return filtered;
  })();
  const currentSelectableRows = isHomeHeroSlidesModule
    ? (Array.isArray(listState.items) ? listState.items : [])
    : visibleEditorRows;
  const currentSelectableIdSet = new Set(
    currentSelectableRows.map((item) => String(item?.id || '')).filter(Boolean)
  );
  const selectedVisibleIds = selectedRowIds.filter((id) => currentSelectableIdSet.has(id));
  const allVisibleSelected = currentSelectableRows.length > 0 && selectedVisibleIds.length === currentSelectableRows.length;
  const listTotal = Number(listState.total || 0);
  const listPageSize = Math.max(1, Number(listState.pageSize || 20));
  const listTotalPages = Math.max(1, Math.ceil(listTotal / listPageSize));
  const currentListPage = Math.min(Math.max(1, Number(listState.page || 1)), listTotalPages);
  const maternalSubcategories = isMaternalTopicsModule && Array.isArray(editing?.subcategories) ? editing.subcategories : [];
  const activeMaternalSubcategory = maternalSubcategories.find((item) => item.slug === maternalSubSlug) || maternalSubcategories[0] || null;
  const maternalArticles = Array.isArray(activeMaternalSubcategory?.articles) ? activeMaternalSubcategory.articles : [];
  const sortedMaternalArticles = maternalArticles.slice().sort(bySortThenUpdated);
  const activeMaternalArticle = maternalArticleSlug
    ? (sortedMaternalArticles.find((item) => item.slug === maternalArticleSlug) || null)
    : null;
  const associationSortedMembers = Array.isArray(editing?.members) ? editing.members.slice().sort(bySortThenUpdated) : [];
  const pendingCount = moduleStats.reduce((sum, item) => sum + item.draft, 0);
  const latestLogModuleLabel = (() => {
    const moduleKey = String(logs?.[0]?.module || '').trim();
    if (!moduleKey) return '暂无';
    if (moduleByKey[moduleKey]?.label) return moduleByKey[moduleKey].label;
    if (moduleKey === 'media') return '图片库';
    if (moduleKey === 'leads') return '公益家园报名';
    if (moduleKey === 'all') return '系统';
    return moduleKey;
  })();
  const hasActiveSortFilter = Boolean(query.trim()) ||
    statusFilter !== 'all' ||
    (isTrainingCourseModule && trainingTrackFilter !== 'all') ||
    (isPromoServiceModule && promoCategoryFilter !== 'all') ||
    (isTopicVideosModule && (
      Boolean(topicVideoTopicFilter.trim()) ||
      Boolean(topicVideoTagFilter.trim()) ||
      topicVideoCardTypeFilter !== 'all'
    ));
  const canDragSortCurrentModule = dragSortableModules.has(currentModule) && !hasActiveSortFilter && !reordering && !saving;
  const activeContentGroupMeta = contentGroups.find((group) => group.title === activeContentGroup) || contentGroups[0];
  const activeContentGroupModules = (activeContentGroupMeta?.modules || [])
    .map((moduleKey) => {
      const config = moduleByKey[moduleKey];
      if (!config) return null;
      const stats = moduleStatsMap[moduleKey] || { total: 0, draft: 0, published: 0 };
      if (!moduleVisibleByPartitionFilter(stats)) return null;
      return { moduleKey, config, stats };
    })
    .filter(Boolean);

  const onQuickUpdateSort = async (row) => {
    const current = Math.max(0, Number(row?.sort_order || 0));
    const input = window.prompt('请输入排序号（从 0 开始，数字越小越靠前）', String(current));
    if (input === null) return;
    const next = Number(input);
    if (!Number.isFinite(next) || next < 0) {
      alert('排序号必须是从 0 开始的正整数');
      return;
    }
    try {
      const detail = await adminApi.getContent(currentModule, row.id);
      const payload = { ...detail, sort_order: Math.floor(next) };
      await adminApi.updateContent(currentModule, row.id, payload);
      if (editing?.id === row.id) {
        setEditing(payload);
        setEditingRaw(JSON.stringify(payload, null, 2));
      }
      await Promise.all([refreshList(currentModule, listState.page), refreshStats()]);
      alert('排序更新成功');
    } catch (error) {
      alert(error.message || '排序更新失败');
    }
  };

  const onReorderModuleByDrag = async (fromId, toId, position = 'before') => {
    if (!fromId || !toId || fromId === toId) return;
    if (!canDragSortCurrentModule) {
      alert('请先清空搜索/筛选条件后再拖拽排序。');
      return;
    }
    setReordering(true);
    try {
      const allRows = (await listAllContent(currentModule)).slice().sort(bySortThenUpdated);
      const fromIndex = allRows.findIndex((item) => item.id === fromId);
      const toIndex = allRows.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
      const originalSortMap = new Map(allRows.map((item) => [item.id, Number(item?.sort_order || 0)]));
      const movedRows = moveArrayItemByPosition(allRows, fromIndex, toIndex, position);
      const normalizedRows = withSequentialSort(movedRows);
      const changedRows = normalizedRows.filter((row) => originalSortMap.get(row.id) !== row.sort_order);
      await Promise.all(changedRows.map((row) =>
        adminApi.updateContent(currentModule, row.id, {
          ...row,
          sort_order: row.sort_order
        })
      ));
      if (editing?.id) {
        const edited = normalizedRows.find((item) => item.id === editing.id);
        if (edited) {
          setEditing(edited);
          setEditingRaw(JSON.stringify(edited, null, 2));
        }
      }
      await Promise.all([refreshList(currentModule, listState.page), refreshStats()]);
    } catch (error) {
      alert(error.message || '拖拽排序失败');
    } finally {
      setReordering(false);
      setDraggingRowId('');
      setModuleDropTarget(null);
    }
  };

  const onReorderAssociationMemberByDrag = (fromId, toId, position = 'before') => {
    if (!fromId || !toId || fromId === toId) return;
    updateEditing((prev) => {
      const members = Array.isArray(prev?.members) ? prev.members.slice().sort(bySortThenUpdated) : [];
      const fromIndex = members.findIndex((item) => item.id === fromId);
      const toIndex = members.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return prev;
      return {
        ...prev,
        members: withSequentialSort(moveArrayItemByPosition(members, fromIndex, toIndex, position))
      };
    });
    setDraggingMemberId('');
    setMemberDropTarget(null);
  };

  const onReorderMaternalArticleByDrag = (fromSlug, toSlug, position = 'before') => {
    if (!fromSlug || !toSlug || fromSlug === toSlug) return;
    updateEditing((prev) => {
      if (!prev) return prev;
      const subcategories = Array.isArray(prev.subcategories) ? prev.subcategories.slice() : [];
      const subIndex = subcategories.findIndex((item) => item.slug === maternalSubSlug);
      if (subIndex < 0) return prev;
      const sub = { ...subcategories[subIndex] };
      const articles = Array.isArray(sub.articles) ? sub.articles.slice().sort(bySortThenUpdated) : [];
      const fromIndex = articles.findIndex((item) => item.slug === fromSlug);
      const toIndex = articles.findIndex((item) => item.slug === toSlug);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return prev;
      sub.articles = withSequentialSort(moveArrayItemByPosition(articles, fromIndex, toIndex, position));
      subcategories[subIndex] = sub;
      return { ...prev, subcategories };
    });
    setDraggingMaternalArticleSlug('');
    setMaternalArticleDropTarget(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: adminBgColor, color: adminTextColor }}>
      <div className="flex min-h-screen">
        <aside className="w-[220px] border-r p-4" style={{ borderColor: adminPanelBorderColor, backgroundColor: adminPanelBgColor }}>
          <div className="mb-4">
            <div className="text-lg font-bold">后台管理</div>
            <div className="text-xs text-[#6B7280]">{user.email}</div>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onMenuClick(item.key)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${activeMenu === item.key ? 'text-white' : 'hover:bg-[#F5F3F4]'}`}
                style={activeMenu === item.key ? { backgroundColor: adminUi.accent } : {}}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button onClick={onLogout} className="mt-6 w-full rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm">退出登录</button>
        </aside>

        <main className="flex-1 p-6 space-y-6">
          {activeMenu === 'dashboard' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={cardStyle}><div className="text-sm text-[#6B7280]">待发布内容</div><div className="mt-1 text-3xl font-bold">{pendingCount}</div></div>
                <div className={cardStyle}><div className="text-sm text-[#6B7280]">内容模块数</div><div className="mt-1 text-3xl font-bold">{moduleStats.length}</div></div>
                <div className={cardStyle}><div className="text-sm text-[#6B7280]">最近修改</div><div className="mt-1 text-base">{latestLogModuleLabel}</div></div>
              </div>
              <div className={cardStyle}>
                <h2 className="text-lg font-semibold">模块状态</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentGroups.map((group) => (
                    <div key={group.title}>
                      <h3 className="mb-2 text-sm font-semibold text-[#4B5563]">{group.title}</h3>
                      <section className="rounded-lg border border-[#E5C0C8] bg-white p-3">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 border-b border-[#F0E7EA] pb-2 text-xs font-medium text-[#6B7280]">
                          <div>模块</div>
                          <div>总计</div>
                          <div>已发布</div>
                          <div>草稿</div>
                        </div>
                        <div className="mt-1 divide-y divide-[#F0E7EA]">
                          {group.modules.map((moduleKey) => {
                            const config = moduleByKey[moduleKey];
                            if (!config) return null;
                            const stats = moduleStatsMap[moduleKey] || { total: 0, published: 0, draft: 0 };
                            return (
                              <div key={`dashboard-${moduleKey}`} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 py-2 text-sm">
                                <div className="font-medium text-[#1F2937]">{config.label}</div>
                                <div className="text-[#4B5563]">{stats.total}</div>
                                <div className="text-[#4B5563]">{stats.published}</div>
                                <div className="text-[#4B5563]">{stats.draft}</div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {activeMenu === 'content' ? (
            <>
              {contentPage === 'partition' ? (
                <div className={`${cardStyle} p-0 overflow-hidden`}>
                  <div className="border-b border-[#F0E7EA] px-4 py-4 md:px-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-semibold text-[#1F2937]">网站内容分区</h2>
                        <p className="mt-1 text-sm text-[#6B7280]">先选分区，再处理模块。</p>
                      </div>
                      <div className="inline-flex rounded-lg border border-[#E5C0C8] bg-white p-1">
                        {contentPartitionStatusFilters.map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setContentPartitionFilter(item.key)}
                            className={`rounded-md px-3 py-1.5 text-sm transition ${
                              contentPartitionFilter === item.key
                                ? 'bg-[#FFF1F4] text-[#C73A5C] border border-[#F3D5DC]'
                                : 'text-[#4B5563] hover:text-[#1F2937]'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="border-b lg:border-b-0 lg:border-r border-[#F0E7EA] bg-[#FFF9FB] p-3">
                      <div className="space-y-2">
                        {contentGroups.map((group) => {
                          const isActive = group.title === activeContentGroupMeta?.title;
                          return (
                            <div key={group.title} className="rounded-lg border border-transparent">
                              <div
                                className={`flex items-center gap-2 rounded-lg px-2 py-2 transition ${
                                  isActive ? 'border border-[#F3D5DC] bg-[#FFF1F4]' : 'hover:bg-white'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => setActiveContentGroup(group.title)}
                                  className="min-w-0 flex-1 text-left"
                                >
                                  <div className="truncate text-sm font-semibold text-[#1F2937]">{group.title}</div>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </aside>

                    <section className="p-4 md:p-5">
                      <div className="mb-4 rounded-lg border border-[#F3D5DC] bg-[#FFF6F9] px-3 py-2 text-xl font-semibold text-[#4B5563]">
                        {activeContentGroupMeta?.title || '分区'}
                      </div>
                      {activeContentGroupModules.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          {activeContentGroupModules.map(({ moduleKey, config, stats }) => (
                            <article key={moduleKey} className="flex h-[170px] flex-col rounded-lg border border-[#E5C0C8] bg-white p-3">
                              <h3 className="text-base font-semibold text-[#1F2937]">{config.label}</h3>
                              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-[#F3F4F6] px-2 py-1 text-[#374151]">总计 {stats.total}</span>
                                <span className="rounded-full bg-[#ECFDF3] px-2 py-1 text-[#166534]">已发布 {stats.published}</span>
                                <span className="rounded-full bg-[#FEF2F2] px-2 py-1 text-[#B91C1C]">草稿 {stats.draft}</span>
                              </div>
                              <div className="mt-auto flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => chooseContentModule(moduleKey)}
                                  className="rounded-md border border-[#E5C0C8] bg-[#FFF7F9] px-3 py-1.5 text-sm text-[#1F2937] hover:bg-[#FFF1F4]"
                                >
                                  进入管理
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-[#E5C0C8] bg-[#FFFCFD] px-4 py-8 text-sm text-[#6B7280]">
                          当前筛选下暂无模块，切换筛选后再试。
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              ) : null}

              {contentPage === 'editor' ? (
                <>
                  <div className={cardStyle}>
                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={backToContentPartition} className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm">返回内容分区</button>
                      <div className="rounded-lg border border-[#194F92] bg-[#EFF6FF] px-3 py-2 text-sm">
                        当前模块：{moduleByKey[currentModule]?.label || currentModule}
                      </div>
                      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索标题/slug" className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm" />
                      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm">
                        <option value="all">全部状态</option>
                        <option value="published">已发布</option>
                        <option value="draft">草稿</option>
                      </select>
                      {isTrainingCourseModule ? (
                        <select value={trainingTrackFilter} onChange={(e) => setTrainingTrackFilter(e.target.value)} className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm">
                          <option value="all">全部方向</option>
                          {trainingTrackOptions.map((track) => (
                            <option key={track.slug} value={track.slug}>{track.name || track.slug}</option>
                          ))}
                        </select>
                      ) : null}
                      {isPromoServiceModule ? (
                        <select value={promoCategoryFilter} onChange={(e) => setPromoCategoryFilter(e.target.value)} className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm">
                          <option value="all">全部分类</option>
                          {promoCategoryOptions.map((category) => (
                            <option key={category.slug} value={category.slug}>{category.name || category.slug}</option>
                          ))}
                        </select>
                      ) : null}
                      {isTopicVideosModule ? (
                        <>
                          <input
                            value={topicVideoTopicFilter}
                            onChange={(e) => setTopicVideoTopicFilter(e.target.value)}
                            placeholder="按专题筛选"
                            className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm"
                          />
                          <input
                            value={topicVideoTagFilter}
                            onChange={(e) => setTopicVideoTagFilter(e.target.value)}
                            placeholder="按标签筛选"
                            className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm"
                          />
                          <select value={topicVideoCardTypeFilter} onChange={(e) => setTopicVideoCardTypeFilter(e.target.value)} className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm">
                            <option value="all">全部卡片类型</option>
                            {topicVideoCardTypeOptions.map((item) => (
                              <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                          </select>
                        </>
                      ) : null}
                      <button onClick={() => refreshList(currentModule, 1)} className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm">查询</button>
                      <button onClick={onCreate} className="rounded-lg bg-[#194F92] px-3 py-2 text-sm text-white">新建</button>
                      <button onClick={toggleSelectAllVisible} className="rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm">
                        {allVisibleSelected ? '取消全选' : '全选'}
                      </button>
                      <button
                        onClick={onDeleteSelected}
                        disabled={!selectedVisibleIds.length || batchDeleting}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {batchDeleting ? '删除中...' : `一键删除（${selectedVisibleIds.length}）`}
                      </button>
                      {isWorkstationGalleryModule ? (
                        <label className={`rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm cursor-pointer ${batchUploadingWorkstation ? 'opacity-60 cursor-not-allowed' : ''}`}>
                          {batchUploadingWorkstation ? '上传中...' : '批量上传（最多10张）'}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={batchUploadingWorkstation}
                            onChange={(e) => onBatchUploadWorkstationPhotos(e.target.files)}
                          />
                        </label>
                      ) : null}
                    </div>
                    {isExpertVoicesModule ? (
                      <p className="mt-3 text-xs text-[#6B7280]">说明：名家名说按排序号从小到大排序，前 3 条已发布内容会展示在首页「名家名说」模块。</p>
                    ) : null}
                    {isProductsModule ? (
                      <p className="mt-3 text-xs text-[#6B7280]">说明：产品按排序号从小到大排序。首页「关爱产品」大图展示排序第 1 的已发布产品。</p>
                    ) : null}
                    {isTrainingTrackModule ? (
                      <p className="mt-3 text-xs text-[#6B7280]">说明：培训方向按排序号从小到大展示。课程关联由课程的所属方向自动生成，无需手工维护。</p>
                    ) : null}
                    {isTrainingCourseModule ? (
                      <p className="mt-3 text-xs text-[#6B7280]">说明：培训课程按排序号从小到大展示。热门科目由「是否热门」控制，并展示在培训中心首页。</p>
                    ) : null}
                    {isPromoCategoryModule ? (
                      <p className="mt-3 text-xs text-[#6B7280]">说明：项目推广分类按排序号从小到大展示。首页项目推广卡片取排序前 3 的已发布分类。</p>
                    ) : null}
                    {isTopicVideosModule ? (
                      <p className="mt-3 text-xs text-[#6B7280]">说明：专题视频支持封面图卡片与视频直出卡片；支持主题/标签/类型筛选。“置顶”用于列表优先展示，“推荐位”用于顶部主视频。</p>
                    ) : null}
                    {isWorkstationGalleryModule ? (
                      <p className="mt-3 text-xs text-[#6B7280]">说明：工作站展示支持批量上传（一次最多10张），图片固定按 4:3 展示，建议上传 1200x900。</p>
                    ) : null}
                    {dragSortableModules.has(currentModule) ? (
                      <p className="mt-3 text-xs text-[#6B7280]">
                        拖拽排序：直接拖动整行到目标位置，蓝线会提示插入点，系统会自动重排排序号。
                        {hasActiveSortFilter ? ' 当前存在搜索/筛选条件，需清空后才能拖拽。' : ''}
                        {reordering ? ' 正在保存排序，请稍候。' : ''}
                      </p>
                    ) : null}
                    <div className="mt-4 overflow-auto">
                      {isHomeHeroSlidesModule ? (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-[#6B7280]">
                              <th className="w-10">
                                <input
                                  type="checkbox"
                                  checked={allVisibleSelected}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    toggleSelectAllVisible();
                                  }}
                                  className="h-4 w-4"
                                />
                              </th>
                              <th>轮播图片</th>
                              <th>状态</th>
                              <th>排序号</th>
                              <th>上传时间</th>
                              <th>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listState.items.map((row) => (
                              <tr
                                key={row.id}
                                draggable={canDragSortCurrentModule}
                                className={`border-t border-[#F0E7EA] align-middle cursor-pointer hover:bg-[#FAF7F8] ${
                                  canDragSortCurrentModule ? 'cursor-move' : ''
                                } ${
                                  moduleDropTarget?.id === row.id && moduleDropTarget?.position === 'before'
                                    ? 'shadow-[inset_0_2px_0_0_#194F92] bg-[#EFF6FF]/40'
                                    : moduleDropTarget?.id === row.id && moduleDropTarget?.position === 'after'
                                      ? 'shadow-[inset_0_-2px_0_0_#194F92] bg-[#EFF6FF]/40'
                                      : ''
                                }`}
                                onClick={() => onEdit(row)}
                                onDragStart={canDragSortCurrentModule ? () => setDraggingRowId(row.id) : undefined}
                                onDragEnd={canDragSortCurrentModule ? () => {
                                  setDraggingRowId('');
                                  setModuleDropTarget(null);
                                } : undefined}
                                onDragOver={canDragSortCurrentModule ? (e) => {
                                  e.preventDefault();
                                  setModuleDropTarget({ id: row.id, position: getDropPosition(e) });
                                } : undefined}
                                onDrop={canDragSortCurrentModule ? (e) => {
                                  e.preventDefault();
                                  onReorderModuleByDrag(draggingRowId, row.id, getDropPosition(e));
                                } : undefined}
                              >
                                <td className="align-middle" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={selectedRowIds.includes(String(row.id))}
                                    onChange={(e) => toggleSelectRow(row.id, e.target.checked)}
                                    className="h-4 w-4"
                                  />
                                </td>
                                <td className="py-2 align-middle">
                                  {row.image ? (
                                    <img src={row.image} alt="轮播图" className="h-14 w-24 rounded object-cover border border-[#F0E7EA]" />
                                  ) : (
                                    <span className="text-[#9CA3AF]">未上传图片</span>
                                  )}
                                </td>
                                <td className="align-middle">{row.status === 'published' ? '已发布' : '草稿'}</td>
                                <td className="align-middle">{Math.max(0, Number(row.sort_order || 0))}</td>
                                <td className="align-middle">{row.created_at?.slice(0, 19).replace('T', ' ') || '-'}</td>
                                <td className="align-middle">
                                  <div className="flex flex-wrap items-center gap-2 py-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(row);
                                      }}
                                      className="rounded border border-[#E5C0C8] px-2 py-1"
                                    >
                                      编辑
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        togglePublish(row);
                                      }}
                                      className="rounded border border-[#E5C0C8] px-2 py-1"
                                    >
                                      {row.status === 'published' ? '下线' : '发布'}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(row);
                                      }}
                                      className="rounded border border-red-200 px-2 py-1 text-red-600"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className={`${isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'text-center' : 'text-left'} text-[#6B7280]`}>
                              <th className="w-10 text-left">
                                <input
                                  type="checkbox"
                                  checked={allVisibleSelected}
                                  onChange={toggleSelectAllVisible}
                                  className="h-4 w-4"
                                />
                              </th>
                              {isHomeLatestTipsModule ? null : <th>{isExpertVoicesModule ? '人物姓名' : '标题'}</th>}
                              {isPromoServiceModule || isAssociationTeamModule ? null : <th>slug</th>}
                              {isTopicVideosModule ? <th>专题</th> : null}
                              {isTopicVideosModule ? <th>卡片类型</th> : null}
                              {isTrainingCourseModule ? <th>所属方向</th> : null}
                              {isPromoServiceModule ? <th>所属分类</th> : null}
                              <th>状态</th>
                              {isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? <th>排序</th> : null}
                              <th>更新时间</th>
                              {isHomeLatestTipsModule ? <th>排序</th> : null}
                              <th>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleEditorRows.map((row) => (
                              <tr
                                key={row.id}
                                draggable={canDragSortCurrentModule}
                                className={`border-t border-[#F0E7EA] ${isHomeLatestTipsModule || isNewsLikeModule || isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'align-middle' : 'align-top'} ${
                                  canDragSortCurrentModule ? 'cursor-move' : ''
                                } ${
                                  moduleDropTarget?.id === row.id && moduleDropTarget?.position === 'before'
                                    ? 'shadow-[inset_0_2px_0_0_#194F92] bg-[#EFF6FF]/40'
                                    : moduleDropTarget?.id === row.id && moduleDropTarget?.position === 'after'
                                      ? 'shadow-[inset_0_-2px_0_0_#194F92] bg-[#EFF6FF]/40'
                                      : ''
                                }`}
                                onDragStart={canDragSortCurrentModule ? () => setDraggingRowId(row.id) : undefined}
                                onDragEnd={canDragSortCurrentModule ? () => {
                                  setDraggingRowId('');
                                  setModuleDropTarget(null);
                                } : undefined}
                                onDragOver={canDragSortCurrentModule ? (e) => {
                                  e.preventDefault();
                                  setModuleDropTarget({ id: row.id, position: getDropPosition(e) });
                                } : undefined}
                                onDrop={canDragSortCurrentModule ? (e) => {
                                  e.preventDefault();
                                  onReorderModuleByDrag(draggingRowId, row.id, getDropPosition(e));
                                } : undefined}
                              >
                                <td className="align-middle text-left">
                                  <input
                                    type="checkbox"
                                    checked={selectedRowIds.includes(String(row.id))}
                                    onChange={(e) => toggleSelectRow(row.id, e.target.checked)}
                                    className="h-4 w-4"
                                  />
                                </td>
                                {isHomeLatestTipsModule ? null : (
                                  <td className={`py-2 ${isHomeLatestTipsModule || isNewsLikeModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'align-middle' : ''} ${isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'text-center' : ''}`}>{titleOf(currentModule, row)}</td>
                                )}
                                {isPromoServiceModule || isAssociationTeamModule ? null : (
                                  <td className={`${isHomeLatestTipsModule || isNewsLikeModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'align-middle' : ''} ${isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'text-center' : ''}`}>{row.slug}</td>
                                )}
                                {isTopicVideosModule ? (
                                  <td className="align-middle">{row.topic || '-'}</td>
                                ) : null}
                                {isTopicVideosModule ? (
                                  <td className="align-middle">{row.cardType === 'embedded_video' ? '视频直出卡片' : '封面图卡片'}</td>
                                ) : null}
                                {isTrainingCourseModule ? (
                                  <td className={`align-middle ${isTrainingModule ? 'text-center' : ''}`}>{trainingTrackNameMap[String(row.trackSlug || '')] || row.trackSlug || '-'}</td>
                                ) : null}
                                {isPromoServiceModule ? (
                                  <td className={`align-middle ${isPromoModule ? 'text-center' : ''}`}>{promoCategoryNameMap[String(row.categorySlug || '')] || row.categorySlug || '-'}</td>
                                ) : null}
                                <td className={`${isHomeLatestTipsModule || isNewsLikeModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'align-middle' : ''} ${isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'text-center' : ''}`}>{row.status === 'published' ? '已发布' : '草稿'}</td>
                                {isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? (
                                  <td className={`align-middle ${isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'text-center' : ''}`}>{Math.max(0, Number(row.sort_order || 0))}</td>
                                ) : null}
                                <td className={`${isHomeLatestTipsModule || isNewsLikeModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'align-middle' : ''} ${isExpertVoicesModule || isHealthLectureModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'text-center' : ''}`}>{row.updated_at?.slice(0, 19).replace('T', ' ')}</td>
                                {isHomeLatestTipsModule ? (
                                  <td className="align-middle">{Math.max(0, Number(row.sort_order || 0))}</td>
                                ) : null}
                                <td className={`${isHomeLatestTipsModule || isNewsLikeModule || isExpertVoicesModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'align-middle' : ''} ${isExpertVoicesModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'text-center' : ''}`}>
                                  <div className={`flex flex-wrap gap-2 py-1 ${isHomeLatestTipsModule || isNewsLikeModule || isExpertVoicesModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'items-center' : ''} ${isExpertVoicesModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule ? 'justify-center' : ''}`}>
                                    <button onClick={() => onEdit(row)} className="rounded border border-[#E5C0C8] px-2 py-1">编辑</button>
                                    {isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule || isTopicVideosModule ? <button onClick={() => onQuickUpdateSort(row)} className="rounded border border-[#E5C0C8] px-2 py-1">排序</button> : null}
                                    <button onClick={() => togglePublish(row)} className="rounded border border-[#E5C0C8] px-2 py-1">{row.status === 'published' ? '下线' : '发布'}</button>
                                    <button onClick={() => onDelete(row)} className="rounded border border-red-200 px-2 py-1 text-red-600">删除</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                      <div className="text-[#6B7280]">
                        每页 {listPageSize} 条，共 {listTotal} 条，当前第 {currentListPage}/{listTotalPages} 页
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => goToListPage(currentListPage - 1)}
                          disabled={currentListPage <= 1}
                          className="rounded border border-[#E5C0C8] px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          上一页
                        </button>
                        {Array.from({ length: listTotalPages }, (_, index) => index + 1)
                          .filter((page) => page === 1 || page === listTotalPages || Math.abs(page - currentListPage) <= 1)
                          .map((page, index, arr) => (
                            <React.Fragment key={`list-page-${page}`}>
                              {index > 0 && page - arr[index - 1] > 1 ? <span className="px-1 text-[#9CA3AF]">...</span> : null}
                              <button
                                type="button"
                                onClick={() => goToListPage(page)}
                                className={`min-w-9 rounded border px-2 py-1.5 ${
                                  page === currentListPage
                                    ? 'border-[#194F92] bg-[#194F92] text-white'
                                    : 'border-[#E5C0C8] text-[#194F92]'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          ))}
                        <button
                          type="button"
                          onClick={() => goToListPage(currentListPage + 1)}
                          disabled={currentListPage >= listTotalPages}
                          className="rounded border border-[#E5C0C8] px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          下一页
                        </button>
                      </div>
                    </div>
                  </div>

                  {editing ? (
                    <div className={cardStyle}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">编辑内容</h2>
                        <div className="space-x-2">
                          <button onClick={() => setRawMode((prev) => !prev)} className="rounded border border-[#E5C0C8] px-3 py-1 text-sm">{rawMode ? '切换简版' : '切换JSON'}</button>
                          <button onClick={() => setEditing(null)} className="rounded border border-[#E5C0C8] px-3 py-1 text-sm">关闭</button>
                        </div>
                      </div>

                      {!rawMode && (currentModuleConfig?.simple || isMaternalTopicsModule || isProductsModule || isTrainingModule || isPromoModule || isAssociationTeamModule || isTopicVideosModule) ? (
                        isMaternalTopicsModule ? (
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <label className="text-sm">专题分类（6类）
                                <input value={pickSimpleField(editing, 'title', '未命名专题')} disabled className="mt-1 w-full rounded border border-[#E5C0C8] bg-[#F9FAFB] px-3 py-2 text-[#6B7280]" />
                              </label>
                              <label className="text-sm">方向（下拉选择）
                                <select
                                  value={activeMaternalSubcategory?.slug || ''}
                                  onChange={(e) => setMaternalSubSlug(e.target.value)}
                                  className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                >
                                  {maternalSubcategories.map((sub) => (
                                    <option key={sub.slug} value={sub.slug}>{sub.title}</option>
                                  ))}
                                </select>
                              </label>
                            </div>

                            <div>
                              <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-medium">文章列表</div>
                                <button
                                  onClick={addMaternalArticle}
                                  className="rounded border border-[#E5C0C8] px-2 py-1 text-sm"
                                >
                                  新增文章
                                </button>
                              </div>
                              {sortedMaternalArticles.length ? (
                                <div className="overflow-auto rounded border border-[#E8D8DD]">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="text-center text-[#6B7280]">
                                        <th className="py-2">标题</th>
                                        <th>slug</th>
                                        <th>状态</th>
                                        <th>排序</th>
                                        <th>更新时间</th>
                                        <th>操作</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sortedMaternalArticles.map((article) => (
                                        <tr
                                          key={article.slug}
                                          draggable={!saving}
                                          className={`border-t border-[#F0E7EA] text-center cursor-move ${
                                            maternalArticleDropTarget?.id === article.slug && maternalArticleDropTarget?.position === 'before'
                                              ? 'shadow-[inset_0_2px_0_0_#194F92] bg-[#EFF6FF]/40'
                                              : maternalArticleDropTarget?.id === article.slug && maternalArticleDropTarget?.position === 'after'
                                                ? 'shadow-[inset_0_-2px_0_0_#194F92] bg-[#EFF6FF]/40'
                                                : ''
                                          }`}
                                          onDragStart={() => setDraggingMaternalArticleSlug(article.slug)}
                                          onDragEnd={() => {
                                            setDraggingMaternalArticleSlug('');
                                            setMaternalArticleDropTarget(null);
                                          }}
                                          onDragOver={(e) => {
                                            e.preventDefault();
                                            setMaternalArticleDropTarget({ id: article.slug, position: getDropPosition(e) });
                                          }}
                                          onDrop={(e) => {
                                            e.preventDefault();
                                            onReorderMaternalArticleByDrag(draggingMaternalArticleSlug, article.slug, getDropPosition(e));
                                          }}
                                        >
                                          <td className="py-2">{article.title || '未命名文章'}</td>
                                          <td>{article.slug || '-'}</td>
                                          <td>{article.status === 'draft' ? '草稿' : '已发布'}</td>
                                          <td>{Math.max(0, Number(article.sort_order || 0))}</td>
                                          <td>{article.updated_at ? article.updated_at.slice(0, 19).replace('T', ' ') : '-'}</td>
                                          <td>
                                            <div className="flex items-center justify-center gap-2 py-1">
                                              <button
                                                onClick={() => setMaternalArticleSlug(article.slug)}
                                                disabled={saving}
                                                className="rounded border border-[#E5C0C8] px-2 py-1"
                                              >
                                                编辑
                                              </button>
                                              <button
                                                onClick={() => toggleMaternalArticlePublishAndSave(article.slug)}
                                                disabled={saving}
                                                className="rounded border border-[#E5C0C8] px-2 py-1"
                                              >
                                                {article.status === 'draft' ? '发布' : '下线'}
                                              </button>
                                              <button
                                                onClick={async () => {
                                                  if (!window.confirm('确认删除该文章吗？')) return;
                                                  await deleteMaternalArticleAndSave(article.slug);
                                                }}
                                                disabled={saving}
                                                className="rounded border border-red-200 px-2 py-1 text-red-600"
                                              >
                                                删除
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="rounded border border-[#E5C0C8] bg-[#FFF9FB] px-3 py-3 text-sm text-[#6B7280]">
                                  当前方向暂无文章，可先在 JSON 模式补充后再回到此处编辑。
                                </div>
                              )}
                            </div>

                            {activeMaternalArticle ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 text-sm font-medium text-[#111827]">
                                  正在编辑：{activeMaternalArticle.title || activeMaternalArticle.slug || '未命名文章'}
                                </div>
                                <label className="text-sm md:col-span-2">文章标题（前端显示）
                                  <input
                                    value={pickSimpleField(activeMaternalArticle, 'title')}
                                    onChange={(e) => updateMaternalArticle((prev) => ({ ...prev, title: e.target.value }))}
                                    className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                  />
                                </label>
                                <label className="text-sm">文章标识 slug（前端路由）
                                  <input
                                    value={pickSimpleField(activeMaternalArticle, 'slug')}
                                    onChange={(e) => {
                                      const nextSlug = e.target.value;
                                      updateMaternalArticle((prev) => ({ ...prev, slug: nextSlug }));
                                      setMaternalArticleSlug(nextSlug);
                                    }}
                                    className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                  />
                                </label>
                                <label className="text-sm">发布时间
                                  <input
                                    type="date"
                                    value={pickSimpleField(activeMaternalArticle, 'publishedAt')}
                                    onChange={(e) => updateMaternalArticle((prev) => ({ ...prev, publishedAt: e.target.value }))}
                                    className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                  />
                                </label>
                                <label className="text-sm">状态
                                  <select
                                    value={activeMaternalArticle.status || 'published'}
                                    onChange={(e) => updateMaternalArticle((prev) => ({ ...prev, status: e.target.value }))}
                                    className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                  >
                                    <option value="published">已发布</option>
                                    <option value="draft">草稿</option>
                                  </select>
                                </label>
                                <label className="text-sm">排序
                                  <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={Number(activeMaternalArticle.sort_order || 0)}
                                    onChange={(e) => updateMaternalArticle((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))}
                                    className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                  />
                                </label>
                                <label className="text-sm md:col-span-2">作者
                                  <input
                                    value={pickSimpleField(activeMaternalArticle, 'author')}
                                    onChange={(e) => updateMaternalArticle((prev) => ({ ...prev, author: e.target.value }))}
                                    className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                  />
                                </label>
                                <label className="text-sm md:col-span-2">正文（每行一段，与前端展示一致）
                                  <textarea
                                    rows={10}
                                    value={toLines(activeMaternalArticle.body)}
                                    onChange={(e) => updateMaternalArticle((prev) => ({ ...prev, body: toParagraphs(e.target.value) }))}
                                    className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                  />
                                </label>
                              </div>
                            ) : null}
                          </div>
                        ) : isTrainingTrackModule ? (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="text-sm">方向名称
                            <input value={pickSimpleField(editing, 'name')} onChange={(e) => updateEditing((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">方向标识 slug
                            <input value={pickSimpleField(editing, 'slug')} onChange={(e) => updateEditing((prev) => ({ ...prev, slug: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">首页分类
                            <select value={editing.homeCategory || '其他'} onChange={(e) => updateEditing((prev) => ({ ...prev, homeCategory: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              {trainingHomeCategoryOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </label>
                          <label className="text-sm">排序号
                            <input type="number" min={0} step={1} value={editing.sort_order ?? 0} onChange={(e) => updateEditing((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">定位描述
                            <textarea rows={3} value={pickSimpleField(editing, 'positioning')} onChange={(e) => updateEditing((prev) => ({ ...prev, positioning: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">Hero标题
                            <input value={pickSimpleField(editing?.hero, 'title')} onChange={(e) => updateEditing((prev) => ({ ...prev, hero: { ...(prev.hero || {}), title: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">Hero副标题
                            <input value={pickSimpleField(editing?.hero, 'subtitle')} onChange={(e) => updateEditing((prev) => ({ ...prev, hero: { ...(prev.hero || {}), subtitle: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">适合人群（每行一条）
                            <textarea rows={3} value={toLines(editing.audience)} onChange={(e) => updateEditing((prev) => ({ ...prev, audience: fromLines(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">就业岗位（每行一条）
                            <textarea rows={3} value={toLines(editing.jobRoles)} onChange={(e) => updateEditing((prev) => ({ ...prev, jobRoles: fromLines(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">课程关联（自动生成，只读）
                            <div className="mt-1 w-full rounded border border-[#E5C0C8] bg-[#F9FAFB] px-3 py-2 text-sm text-[#6B7280]">
                              {(trainingCourseRows || [])
                                .filter((course) => String(course?.trackSlug || '') === String(editing?.slug || ''))
                                .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
                                .map((course) => `${course.name || course.slug}（${course.slug}）`)
                                .join(' / ') || '当前方向暂无关联课程'}
                            </div>
                          </label>
                          <label className="text-sm">状态
                            <select value={editing.status || 'draft'} onChange={(e) => updateEditing((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="draft">草稿</option>
                              <option value="published">已发布</option>
                            </select>
                          </label>
                        </div>
                        ) : isTrainingCourseModule ? (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="text-sm">课程名称
                            <input value={pickSimpleField(editing, 'name')} onChange={(e) => updateEditing((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">课程标识 slug
                            <input value={pickSimpleField(editing, 'slug')} onChange={(e) => updateEditing((prev) => ({ ...prev, slug: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">所属方向
                            <select value={pickSimpleField(editing, 'trackSlug')} onChange={(e) => updateEditing((prev) => ({ ...prev, trackSlug: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="">请选择方向</option>
                              {trainingTrackOptions.map((track) => (
                                <option key={track.slug} value={track.slug}>{track.name || track.slug}</option>
                              ))}
                            </select>
                          </label>
                          <label className="text-sm">排序号
                            <input type="number" min={0} step={1} value={editing.sort_order ?? 0} onChange={(e) => updateEditing((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">学习周期
                            <select value={trainingDurationOptions.includes(pickSimpleField(editing, 'durationTag')) ? pickSimpleField(editing, 'durationTag') : trainingDurationOptions[0]} onChange={(e) => updateEditing((prev) => ({ ...prev, durationTag: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              {trainingDurationOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </label>
                          <label className="text-sm">课程学时
                            <input value={pickSimpleField(editing, 'hours')} onChange={(e) => updateEditing((prev) => ({ ...prev, hours: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">学习方式
                            <input value={pickSimpleField(editing, 'mode')} onChange={(e) => updateEditing((prev) => ({ ...prev, mode: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">费用与班型
                            <input value={pickSimpleField(editing, 'priceNote')} onChange={(e) => updateEditing((prev) => ({ ...prev, priceNote: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">课程证书说明
                            <input value={pickSimpleField(editing, 'certificate')} onChange={(e) => updateEditing((prev) => ({ ...prev, certificate: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">适合人群（单句）
                            <input value={pickSimpleField(editing, 'audience')} onChange={(e) => updateEditing((prev) => ({ ...prev, audience: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">前端优先显示这里的内容；若留空，将显示“适合相关岗位从业者与学习者”。</div>
                          </label>
                          <label className="text-sm">是否含实操
                            <select value={String(Boolean(editing.hasPractical))} onChange={(e) => updateEditing((prev) => ({ ...prev, hasPractical: e.target.value === 'true' }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="true">是</option>
                              <option value="false">否</option>
                            </select>
                            <div className="mt-1 text-xs text-[#6B7280]">用于首页课程卡标签判断：当“是否热门=否”且“是否含实操=是”时显示“实操为主”。</div>
                          </label>
                          <label className="text-sm">是否可考证
                            <select value={String(Boolean(editing.hasCertificate))} onChange={(e) => updateEditing((prev) => ({ ...prev, hasCertificate: e.target.value === 'true' }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="true">是</option>
                              <option value="false">否</option>
                            </select>
                          </label>
                          <label className="text-sm">是否热门科目
                            <select value={String(Boolean(editing.isFeatured))} onChange={(e) => updateEditing((prev) => ({ ...prev, isFeatured: e.target.value === 'true' }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="false">否</option>
                              <option value="true">是</option>
                            </select>
                            <div className="mt-1 text-xs text-[#6B7280]">标签优先级最高：设为“是”时首页课程卡显示“官方推荐”，覆盖“实操为主”。</div>
                          </label>
                          <label className="text-sm">状态
                            <select value={editing.status || 'draft'} onChange={(e) => updateEditing((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="draft">草稿</option>
                              <option value="published">已发布</option>
                            </select>
                          </label>
                          <label className="text-sm md:col-span-2">课程简介
                            <textarea rows={3} value={pickSimpleField(editing, 'summary')} onChange={(e) => updateEditing((prev) => ({ ...prev, summary: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">课程介绍（每行一段）
                            <textarea rows={4} value={toLines(editing.introParagraphs)} onChange={(e) => updateEditing((prev) => ({ ...prev, introParagraphs: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">报考对象
                            <textarea rows={3} value={pickSimpleField(editing, 'examTarget')} onChange={(e) => updateEditing((prev) => ({ ...prev, examTarget: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">课程设置
                            <textarea rows={3} value={pickSimpleField(editing, 'curriculumNote')} onChange={(e) => updateEditing((prev) => ({ ...prev, curriculumNote: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">报名须知（每行一条）
                            <textarea rows={3} value={toLines(editing.registrationNotice)} onChange={(e) => updateEditing((prev) => ({ ...prev, registrationNotice: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">就业方向（每行一条）
                            <textarea rows={3} value={toLines(editing.employmentDirections)} onChange={(e) => updateEditing((prev) => ({ ...prev, employmentDirections: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">培训时间
                            <input value={pickSimpleField(editing, 'trainingTime')} onChange={(e) => updateEditing((prev) => ({ ...prev, trainingTime: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">培训地点
                            <input value={pickSimpleField(editing, 'trainingLocation')} onChange={(e) => updateEditing((prev) => ({ ...prev, trainingLocation: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">招生电话
                            <input value={pickSimpleField(editing?.contactInfo, 'phone')} onChange={(e) => updateEditing((prev) => ({ ...prev, contactInfo: { ...(prev.contactInfo || {}), phone: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">招生地址
                            <input value={pickSimpleField(editing?.contactInfo, 'address')} onChange={(e) => updateEditing((prev) => ({ ...prev, contactInfo: { ...(prev.contactInfo || {}), address: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">证书图地址
                            <input value={pickSimpleField(editing, 'certificateImage')} onChange={(e) => updateEditing((prev) => ({ ...prev, certificateImage: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-2 flex items-center gap-2">
                              <label className="inline-flex cursor-pointer items-center rounded border border-[#E5C0C8] px-2 py-1 text-xs hover:bg-[#FAF7F8]">
                                上传并填入
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => onInlineImageUpload('certificateImage', e.target.files)}
                                />
                              </label>
                              <span className="text-xs text-[#6B7280]">建议尺寸：900 x 600 像素，JPG/PNG，单张建议不超过 2MB</span>
                            </div>
                          </label>
                          <label className="text-sm md:col-span-2">证书图说明 alt
                            <input value={pickSimpleField(editing, 'certificateImageAlt')} onChange={(e) => updateEditing((prev) => ({ ...prev, certificateImageAlt: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                        </div>
                        ) : isPromoCategoryModule ? (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="text-sm">分类名称
                            <input value={pickSimpleField(editing, 'name')} onChange={(e) => updateEditing((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">分类标识 slug
                            <input value={pickSimpleField(editing, 'slug')} onChange={(e) => updateEditing((prev) => ({ ...prev, slug: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">排序号
                            <input type="number" min={0} step={1} value={editing.sort_order ?? 0} onChange={(e) => updateEditing((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">场景标签
                            <input value={pickSimpleField(editing, 'sceneLabel')} onChange={(e) => updateEditing((prev) => ({ ...prev, sceneLabel: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">用于首页“项目推广”卡片顶部角标（如：医疗协作/细胞储存）。</div>
                          </label>
                          <label className="text-sm">状态
                            <select value={editing.status || 'draft'} onChange={(e) => updateEditing((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="draft">草稿</option>
                              <option value="published">已发布</option>
                            </select>
                          </label>
                          <label className="text-sm md:col-span-2">定位描述
                            <textarea rows={3} value={pickSimpleField(editing, 'positioning')} onChange={(e) => updateEditing((prev) => ({ ...prev, positioning: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">Hero标题
                            <input value={pickSimpleField(editing?.hero, 'title')} onChange={(e) => updateEditing((prev) => ({ ...prev, hero: { ...(prev.hero || {}), title: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">Hero副标题
                            <input value={pickSimpleField(editing?.hero, 'subtitle')} onChange={(e) => updateEditing((prev) => ({ ...prev, hero: { ...(prev.hero || {}), subtitle: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">高亮标签（每行一条）
                            <textarea rows={3} value={toLines(editing.highlights)} onChange={(e) => updateEditing((prev) => ({ ...prev, highlights: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">关联服务（只读）
                            <div className="mt-1 w-full rounded border border-[#E5C0C8] bg-[#F9FAFB] px-3 py-2 text-sm text-[#6B7280]">
                              {(promoServiceRows || [])
                                .filter((service) => String(service?.categorySlug || '') === String(editing?.slug || ''))
                                .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
                                .map((service) => `${service.title || service.slug}（${service.slug}）`)
                                .join(' / ') || '当前分类暂无关联服务'}
                            </div>
                          </label>
                        </div>
                        ) : isPromoServiceModule ? (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="text-sm">服务标题
                            <input value={pickSimpleField(editing, 'title')} onChange={(e) => updateEditing((prev) => ({ ...prev, title: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">服务标识 slug
                            <input value={pickSimpleField(editing, 'slug')} onChange={(e) => updateEditing((prev) => ({ ...prev, slug: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">所属分类
                            <select value={pickSimpleField(editing, 'categorySlug')} onChange={(e) => updateEditing((prev) => ({ ...prev, categorySlug: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="">请选择分类</option>
                              {promoCategoryOptions.map((category) => (
                                <option key={category.slug} value={category.slug}>{category.name || category.slug}</option>
                              ))}
                            </select>
                            <div className="mt-1 text-xs text-[#6B7280]">前端会按这里归类到对应的项目推广分类页。</div>
                          </label>
                          <label className="text-sm">排序号
                            <input type="number" min={0} step={1} value={editing.sort_order ?? 0} onChange={(e) => updateEditing((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">副标题
                            <input value={pickSimpleField(editing, 'subtitle')} onChange={(e) => updateEditing((prev) => ({ ...prev, subtitle: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">前端分类页卡片和详情页标题下方优先显示此字段。</div>
                          </label>
                          <label className="text-sm">交付周期
                            <input value={pickSimpleField(editing, 'deliveryCycle')} onChange={(e) => updateEditing((prev) => ({ ...prev, deliveryCycle: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">前端分类页筛选项“交付周期”来源于此字段。</div>
                          </label>
                          <label className="text-sm">价格区间
                            <input value={pickSimpleField(editing, 'priceRange')} onChange={(e) => updateEditing((prev) => ({ ...prev, priceRange: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">前端分类卡片与详情页都会展示价格区间。</div>
                          </label>
                          <label className="text-sm">状态
                            <select value={editing.status || 'draft'} onChange={(e) => updateEditing((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="draft">草稿</option>
                              <option value="published">已发布</option>
                            </select>
                          </label>
                          <label className="text-sm md:col-span-2">服务摘要
                            <textarea rows={3} value={pickSimpleField(editing, 'summary')} onChange={(e) => updateEditing((prev) => ({ ...prev, summary: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">前端分类页卡片与详情页正文简介优先显示该内容。</div>
                          </label>
                          <label className="text-sm md:col-span-2">适用对象（每行一条）
                            <textarea rows={3} value={toLines(editing.audience)} onChange={(e) => updateEditing((prev) => ({ ...prev, audience: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">对象标签（每行一条）
                            <textarea rows={3} value={toLines(editing.audienceTags)} onChange={(e) => updateEditing((prev) => ({ ...prev, audienceTags: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">前端分类页筛选项“适用对象”来源于这里。</div>
                          </label>
                          <label className="text-sm md:col-span-2">服务流程（每行一步）
                            <textarea rows={4} value={toLines(editing.process)} onChange={(e) => updateEditing((prev) => ({ ...prev, process: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">覆盖地区（每行一条）
                            <textarea rows={3} value={toLines(editing.regions)} onChange={(e) => updateEditing((prev) => ({ ...prev, regions: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">前端分类页筛选项“地区”来源于这里。</div>
                          </label>
                          <label className="text-sm md:col-span-2">价格影响因素（每行一条）
                            <textarea rows={3} value={toLines(editing.priceFactors)} onChange={(e) => updateEditing((prev) => ({ ...prev, priceFactors: fromLines(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">能力亮点（每行一条）
                            <textarea rows={3} value={toLines(editing.capabilities)} onChange={(e) => updateEditing((prev) => ({ ...prev, capabilities: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-1 text-xs text-[#6B7280]">前端详情页“设施与能力”展示；首页项目推广“核心能力摘要”也会优先抽取该字段。</div>
                          </label>
                          <label className="text-sm md:col-span-2">资质与标准（每行一条）
                            <textarea rows={3} value={toLines(editing.certifications)} onChange={(e) => updateEditing((prev) => ({ ...prev, certifications: fromLinesPreserve(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">常见问题（每行：问题|回答）
                            <textarea
                              rows={4}
                              value={pickSimpleField(editing, 'faq_input', faqToLines(editing.faq))}
                              onChange={(e) =>
                                updateEditing((prev) => ({
                                  ...prev,
                                  faq_input: e.target.value,
                                  faq: linesToFaq(e.target.value)
                                }))
                              }
                              className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                            />
                          </label>
                          <label className="text-sm">联系电话
                            <input value={pickSimpleField(editing?.contact, 'phone')} onChange={(e) => updateEditing((prev) => ({ ...prev, contact: { ...(prev.contact || {}), phone: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">微信号
                            <input value={pickSimpleField(editing?.contact, 'wechat')} onChange={(e) => updateEditing((prev) => ({ ...prev, contact: { ...(prev.contact || {}), wechat: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">联系地址
                            <input value={pickSimpleField(editing?.contact, 'address')} onChange={(e) => updateEditing((prev) => ({ ...prev, contact: { ...(prev.contact || {}), address: e.target.value } }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">封面图地址
                            <input value={pickSimpleField(editing, 'coverImage')} onChange={(e) => updateEditing((prev) => ({ ...prev, coverImage: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-2 flex items-center gap-2">
                              <label className="inline-flex cursor-pointer items-center rounded border border-[#E5C0C8] px-2 py-1 text-xs hover:bg-[#FAF7F8]">
                                上传并填入
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => onInlineImageUpload('coverImage', e.target.files)}
                                />
                              </label>
                              <span className="text-xs text-[#6B7280]">建议尺寸：1200 x 675 像素，JPG/PNG，单张建议不超过 2MB</span>
                            </div>
                            <div className="mt-1 text-xs text-[#6B7280]">前端分类页卡片优先展示该封面图。</div>
                          </label>
                          <label className="text-sm md:col-span-2">风险提示
                            <textarea rows={3} value={pickSimpleField(editing, 'riskNotice')} onChange={(e) => updateEditing((prev) => ({ ...prev, riskNotice: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">合规说明
                            <textarea rows={3} value={pickSimpleField(editing, 'complianceNotice')} onChange={(e) => updateEditing((prev) => ({ ...prev, complianceNotice: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                        </div>
                        ) : isTopicVideosModule ? (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="text-sm">视频标识 slug
                            <input value={pickSimpleField(editing, 'slug')} onChange={(e) => updateEditing((prev) => ({ ...prev, slug: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">视频标题
                            <input value={pickSimpleField(editing, 'title')} onChange={(e) => updateEditing((prev) => ({ ...prev, title: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">卡片类型
                            <select
                              value={pickSimpleField(editing, 'cardType', 'image_link')}
                              onChange={(e) => updateEditing((prev) => ({ ...prev, cardType: e.target.value }))}
                              className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                            >
                              {topicVideoCardTypeOptions.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              ))}
                            </select>
                          </label>
                          <label className="text-sm">排序号
                            <input type="number" min={0} step={1} value={editing.sort_order ?? 0} onChange={(e) => updateEditing((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">专题
                            <input value={pickSimpleField(editing, 'topic')} onChange={(e) => updateEditing((prev) => ({ ...prev, topic: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">时长（如 12:30）
                            <input value={pickSimpleField(editing, 'duration')} onChange={(e) => updateEditing((prev) => ({ ...prev, duration: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">状态
                            <select value={editing.status || 'draft'} onChange={(e) => updateEditing((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="draft">草稿</option>
                              <option value="published">已发布</option>
                            </select>
                          </label>
                          <label className="text-sm">置顶
                            <select value={String(Boolean(editing.isPinned))} onChange={(e) => updateEditing((prev) => ({ ...prev, isPinned: e.target.value === 'true' }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="false">否</option>
                              <option value="true">是</option>
                            </select>
                            <div className="mt-1 text-xs text-[#6B7280]">置顶用于列表优先级，开启后该视频在总览列表中优先展示。</div>
                          </label>
                          <label className="text-sm">推荐位
                            <select value={String(Boolean(editing.isFeatured))} onChange={(e) => updateEditing((prev) => ({ ...prev, isFeatured: e.target.value === 'true' }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="false">否</option>
                              <option value="true">是</option>
                            </select>
                            <div className="mt-1 text-xs text-[#6B7280]">推荐位用于顶部主视频，开启后优先作为页面主展示视频。</div>
                          </label>
                          <label className="text-sm md:col-span-2">视频摘要
                            <textarea rows={3} value={pickSimpleField(editing, 'summary')} onChange={(e) => updateEditing((prev) => ({ ...prev, summary: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">页面简介（右侧“视频简介”区域）
                            <textarea rows={3} value={pickSimpleField(editing, 'pageIntro')} onChange={(e) => updateEditing((prev) => ({ ...prev, pageIntro: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          {pickSimpleField(editing, 'cardType', 'image_link') === 'image_link' ? (
                            <>
                              <label className="text-sm md:col-span-2">封面图地址（必填）
                                <input value={pickSimpleField(editing, 'coverImage')} onChange={(e) => updateEditing((prev) => ({ ...prev, coverImage: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                                <div className="mt-2 flex items-center gap-2">
                                  <label className="inline-flex cursor-pointer items-center rounded border border-[#E5C0C8] px-2 py-1 text-xs hover:bg-[#FAF7F8]">
                                    上传并填入
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => onInlineImageUpload('coverImage', e.target.files)}
                                    />
                                  </label>
                                  <span className="text-xs text-[#6B7280]">建议尺寸：1200 x 675 像素，JPG/PNG，单张建议不超过 2MB</span>
                                </div>
                              </label>
                              <label className="text-sm md:col-span-2">跳转链接（必填）
                                <div className="mt-1 flex gap-2">
                                  <input value={pickSimpleField(editing, 'actionUrl')} onChange={(e) => updateEditing((prev) => ({ ...prev, actionUrl: e.target.value }))} className="w-full rounded border border-[#E5C0C8] px-3 py-2" />
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const value = pickSimpleField(editing, 'actionUrl').trim();
                                      if (!value) return alert('请先填写跳转链接');
                                      try {
                                        const result = await adminApi.validateTopicVideoLink(value);
                                        if (result?.valid) {
                                          updateEditing((prev) => ({ ...prev, linkDomain: result.domain || prev.linkDomain || '' }));
                                          alert(`链接可用，域名：${result.domain || '-'}`);
                                        } else {
                                          alert(result?.reason || '链接不可用');
                                        }
                                      } catch (error) {
                                        alert(error.message || '链接校验失败');
                                      }
                                    }}
                                    className="shrink-0 rounded border border-[#E5C0C8] px-3 py-2 text-sm"
                                  >
                                    链接预检
                                  </button>
                                </div>
                              </label>
                            </>
                          ) : null}
                          {pickSimpleField(editing, 'cardType', 'image_link') === 'embedded_video' ? (
                            <label className="text-sm md:col-span-2">播放链接（必填）
                              <div className="mt-1 flex gap-2">
                                <input value={pickSimpleField(editing, 'playUrl')} onChange={(e) => updateEditing((prev) => ({ ...prev, playUrl: e.target.value }))} className="w-full rounded border border-[#E5C0C8] px-3 py-2" />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const value = pickSimpleField(editing, 'playUrl').trim();
                                    if (!value) return alert('请先填写播放链接');
                                    try {
                                      const result = await adminApi.validateTopicVideoLink(value);
                                      if (result?.valid) {
                                        updateEditing((prev) => ({ ...prev, linkDomain: result.domain || prev.linkDomain || '' }));
                                        alert(`链接可用，域名：${result.domain || '-'}`);
                                      } else {
                                        alert(result?.reason || '链接不可用');
                                      }
                                    } catch (error) {
                                      alert(error.message || '链接校验失败');
                                    }
                                  }}
                                  className="shrink-0 rounded border border-[#E5C0C8] px-3 py-2 text-sm"
                                >
                                  链接预检
                                </button>
                              </div>
                            </label>
                          ) : null}
                          <label className="text-sm md:col-span-2">标签（支持逗号、顿号、换行）
                            <textarea
                              rows={3}
                              value={pickSimpleField(editing, 'tags_input', Array.isArray(editing.tags) ? editing.tags.join('、') : '')}
                              onChange={(e) =>
                                updateEditing((prev) => ({
                                  ...prev,
                                  tags_input: e.target.value,
                                  tags: parseTags(e.target.value)
                                }))
                              }
                              className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                            />
                          </label>
                          <label className="text-sm">链接域名（自动识别）
                            <input value={pickSimpleField(editing, 'linkDomain')} disabled className="mt-1 w-full rounded border border-[#E5C0C8] bg-[#F9FAFB] px-3 py-2 text-[#6B7280]" />
                          </label>
                        </div>
                        ) : isAssociationTeamModule ? (
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="text-sm">职务标识
                              <input
                                value={pickSimpleField(editing, 'roleKey')}
                                onChange={(e) => updateEditing((prev) => ({ ...prev, roleKey: e.target.value, slug: e.target.value }))}
                                className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                              />
                              <div className="mt-1 text-xs text-[#6B7280]">用于唯一识别该职务，建议英文/数字（如：`vice-president`）。</div>
                            </label>
                            <label className="text-sm">职务名称
                              <input
                                value={pickSimpleField(editing, 'roleTitle', pickSimpleField(editing, 'title'))}
                                onChange={(e) => updateEditing((prev) => ({ ...prev, roleTitle: e.target.value, title: e.target.value }))}
                                className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                              />
                            </label>
                            <label className="text-sm">排序号（可手动输入）
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={editing.sort_order ?? 0}
                                onChange={(e) => updateEditing((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))}
                                className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                              />
                              <div className="mt-1 text-xs text-[#6B7280]">数字越小越靠前显示。</div>
                            </label>
                            <label className="text-sm">状态
                              <select
                                value={editing.status || 'draft'}
                                onChange={(e) => updateEditing((prev) => ({ ...prev, status: e.target.value }))}
                                className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                              >
                                <option value="draft">草稿</option>
                                <option value="published">已发布</option>
                              </select>
                            </label>
                          </div>

                          <div className="rounded border border-[#E8D8DD]">
                            <div className="flex items-center justify-between border-b border-[#E8D8DD] bg-[#FFF9FB] px-3 py-2">
                              <div className="text-sm font-medium text-[#1F2937]">成员列表</div>
                              <button
                                onClick={() =>
                                  updateEditing((prev) => {
                                    const members = Array.isArray(prev?.members) ? [...prev.members] : [];
                                    members.push({
                                      id: `member-${Date.now()}`,
                                      image: '',
                                      caption: '',
                                      sort_order: members.length
                                    });
                                    return { ...prev, members };
                                  })
                                }
                                className="rounded border border-[#E5C0C8] px-2 py-1 text-sm"
                              >
                                新增成员
                              </button>
                            </div>

                            {associationSortedMembers.length ? (
                              <div className="divide-y divide-[#F0E7EA]">
                                {associationSortedMembers.map((member, index) => (
                                    <div
                                      key={member.id || `${index}`}
                                      draggable
                                      className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-3 cursor-move ${
                                        memberDropTarget?.id === member.id && memberDropTarget?.position === 'before'
                                          ? 'shadow-[inset_0_2px_0_0_#194F92] bg-[#EFF6FF]/40'
                                          : memberDropTarget?.id === member.id && memberDropTarget?.position === 'after'
                                            ? 'shadow-[inset_0_-2px_0_0_#194F92] bg-[#EFF6FF]/40'
                                            : ''
                                      }`}
                                      onDragStart={() => setDraggingMemberId(member.id)}
                                      onDragEnd={() => {
                                        setDraggingMemberId('');
                                        setMemberDropTarget(null);
                                      }}
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        setMemberDropTarget({ id: member.id, position: getDropPosition(e) });
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        onReorderAssociationMemberByDrag(draggingMemberId, member.id, getDropPosition(e));
                                      }}
                                    >
                                      <label className="text-sm md:col-span-2">排序（可手动输入）
                                        <input
                                          type="number"
                                          min={0}
                                          step={1}
                                          value={Number(member.sort_order ?? index)}
                                          onChange={(e) =>
                                            updateEditing((prev) => ({
                                              ...prev,
                                              members: (Array.isArray(prev.members) ? prev.members : []).map((item) =>
                                                item.id === member.id ? { ...item, sort_order: Number(e.target.value || 0) } : item
                                              )
                                            }))
                                          }
                                          className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                        />
                                        <div className="mt-1 text-xs text-[#6B7280]">数字越小越靠前显示。</div>
                                      </label>
                                      <label className="text-sm md:col-span-4">图片地址
                                        <input
                                          value={pickSimpleField(member, 'image')}
                                          onChange={(e) =>
                                            updateEditing((prev) => ({
                                              ...prev,
                                              members: (Array.isArray(prev.members) ? prev.members : []).map((item) =>
                                                item.id === member.id ? { ...item, image: e.target.value } : item
                                              )
                                            }))
                                          }
                                          className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                        />
                                        <div className="mt-2">
                                          <label className="inline-flex cursor-pointer items-center rounded border border-[#E5C0C8] px-2 py-1 text-xs hover:bg-[#FAF7F8]">
                                            上传并填入
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={async (e) => {
                                                const file = Array.from(e.target.files || [])[0];
                                                if (!file) return;
                                                try {
                                                  const { dataUrl, fileName, size } = await compressImage(file);
                                                  const uploaded = await adminApi.uploadMedia(fileName, dataUrl, size, currentModule);
                                                  updateEditing((prev) => ({
                                                    ...prev,
                                                    members: (Array.isArray(prev.members) ? prev.members : []).map((item) =>
                                                      item.id === member.id ? { ...item, image: uploaded.url } : item
                                                    )
                                                  }));
                                                  await refreshMedia();
                                                } catch (error) {
                                                  alert(error.message || '上传失败，请重试');
                                                }
                                              }}
                                            />
                                          </label>
                                        </div>
                                        <div className="mt-1 text-xs text-[#6B7280]">建议使用一寸证件照比例（宽:高=5:7），推荐尺寸 `295 x 413` 像素。</div>
                                      </label>
                                      <label className="text-sm md:col-span-4">姓名
                                        <input
                                          value={pickSimpleField(member, 'caption')}
                                          onChange={(e) =>
                                            updateEditing((prev) => ({
                                              ...prev,
                                              members: (Array.isArray(prev.members) ? prev.members : []).map((item) =>
                                                item.id === member.id ? { ...item, caption: e.target.value } : item
                                              )
                                            }))
                                          }
                                          className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                        />
                                      </label>
                                      <div className="md:col-span-2 flex items-end">
                                        <button
                                          onClick={() =>
                                            updateEditing((prev) => ({
                                              ...prev,
                                              members: (Array.isArray(prev.members) ? prev.members : []).filter((item) => item.id !== member.id)
                                            }))
                                          }
                                          className="rounded border border-red-200 px-3 py-2 text-sm text-red-600"
                                        >
                                          删除成员
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="p-3 text-sm text-[#6B7280]">暂无成员，点击“新增成员”开始维护。</div>
                            )}
                          </div>
                          <p className="text-xs text-[#6B7280]">说明：前端每行最多显示 4 张成员卡片，超出自动换行；图片下文字固定居中显示。</p>
                        </div>
                        ) : isProductsModule ? (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="text-sm">产品标识 slug
                            <input value={pickSimpleField(editing, 'slug')} onChange={(e) => updateEditing((prev) => ({ ...prev, slug: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">产品名称
                            <input value={pickSimpleField(editing, 'name')} onChange={(e) => updateEditing((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">产品分类
                            <input value={pickSimpleField(editing, 'category')} onChange={(e) => updateEditing((prev) => ({ ...prev, category: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">标签
                            <input value={pickSimpleField(editing, 'tag')} onChange={(e) => updateEditing((prev) => ({ ...prev, tag: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">封面图片地址
                            <input value={pickSimpleField(editing, 'cover')} onChange={(e) => updateEditing((prev) => ({ ...prev, cover: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            <div className="mt-2 flex items-center gap-2">
                              <label className="inline-flex cursor-pointer items-center rounded border border-[#E5C0C8] px-2 py-1 text-xs hover:bg-[#FAF7F8]">
                                上传并填入
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => onInlineImageUpload('cover', e.target.files)}
                                />
                              </label>
                              <span className="text-xs text-[#6B7280]">建议尺寸：1200 x 675 像素，JPG/PNG，单张建议不超过 2MB</span>
                            </div>
                          </label>
                          <label className="text-sm">排序号
                            <input type="number" min={0} step={1} value={editing.sort_order ?? 0} onChange={(e) => updateEditing((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm">状态
                            <select value={editing.status || 'draft'} onChange={(e) => updateEditing((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                              <option value="draft">草稿</option>
                              <option value="published">已发布</option>
                            </select>
                          </label>
                          <label className="text-sm md:col-span-2">高亮卖点（每行一条）
                            <textarea rows={3} value={toLines(editing.highlights)} onChange={(e) => updateEditing((prev) => ({ ...prev, highlights: fromLines(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">商品参数（每行：参数名:参数值）
                            <textarea rows={4} value={specsToLines(editing.specs)} onChange={(e) => updateEditing((prev) => ({ ...prev, specs: linesToSpecs(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">商品介绍（每行一段）
                            <textarea rows={5} value={toLines(editing.description)} onChange={(e) => updateEditing((prev) => ({ ...prev, description: fromLines(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">使用建议（每行一条）
                            <textarea rows={4} value={toLines(editing.usage)} onChange={(e) => updateEditing((prev) => ({ ...prev, usage: fromLines(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                          <label className="text-sm md:col-span-2">常见问题（每行：问题|回答）
                            <textarea rows={4} value={faqToLines(editing.faq)} onChange={(e) => updateEditing((prev) => ({ ...prev, faq: linesToFaq(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                          </label>
                        </div>
                        ) : (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {!isHomeHeroSlidesModule && !isExpertVoicesModule ? (
                            <label className="text-sm">{currentModuleConfig?.slugLabel || 'slug'}
                              <input value={pickSimpleField(editing, currentModuleConfig.slugField || 'slug')} onChange={(e) => updateEditing((prev) => ({ ...prev, [currentModuleConfig.slugField || 'slug']: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            </label>
                          ) : null}
                          {!isHomeHeroSlidesModule && !isHomeLatestTipsModule ? (
                            <label className="text-sm">{currentModuleConfig?.titleLabel || '标题'}
                              <input value={pickSimpleField(editing, currentModuleConfig.titleField || 'title')} onChange={(e) => updateEditing((prev) => ({ ...prev, [currentModuleConfig.titleField || 'title']: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            </label>
                          ) : null}
                          {isExpertVoicesModule ? (
                            <label className="text-sm">身份职务（副标题）
                              <input value={pickSimpleField(editing, 'title')} onChange={(e) => updateEditing((prev) => ({ ...prev, title: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            </label>
                          ) : null}
                          {isExpertVoicesModule ? (
                            <label className="text-sm">所属单位
                              <input value={pickSimpleField(editing, 'institution')} onChange={(e) => updateEditing((prev) => ({ ...prev, institution: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            </label>
                          ) : null}
                          {currentModuleConfig.dateField ? (
                            <label className="text-sm">{currentModuleConfig?.dateLabel || '日期'}
                              <input
                                type={currentModuleConfig?.dateInputType || 'text'}
                                value={pickSimpleField(editing, currentModuleConfig.dateField)}
                                onChange={(e) => updateEditing((prev) => ({ ...prev, [currentModuleConfig.dateField]: e.target.value }))}
                                className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                              />
                            </label>
                          ) : null}
                          {Array.isArray(currentModuleConfig?.extraFields) ? currentModuleConfig.extraFields.map((field) => (
                            <label key={field.key} className="text-sm">
                              {field.label || field.key}
                              <input
                                type={field.type || 'text'}
                                value={pickSimpleField(editing, field.key)}
                                onChange={(e) => updateEditing((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                              />
                            </label>
                          )) : null}
                          {currentModuleConfig.imageField ? (
                            <label className="text-sm">{currentModuleConfig?.imageLabel || '图片地址'}
                              <input value={pickSimpleField(editing, currentModuleConfig.imageField)} onChange={(e) => updateEditing((prev) => ({ ...prev, [currentModuleConfig.imageField]: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                              <div className="mt-2 flex items-center gap-2">
                                <label className="inline-flex cursor-pointer items-center rounded border border-[#E5C0C8] px-2 py-1 text-xs hover:bg-[#FAF7F8]">
                                  上传并填入
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => onInlineImageUpload(currentModuleConfig.imageField, e.target.files)}
                                  />
                                </label>
                                <span className="text-xs text-[#6B7280]">上传后会自动写入当前字段</span>
                              </div>
                              {currentModuleConfig?.recommendedImageSize ? (
                                <div className="mt-1 text-xs text-[#6B7280]">{currentModuleConfig.recommendedImageSize}</div>
                              ) : null}
                            </label>
                          ) : null}
                          {!isNewsLikeModule ? (
                            <label className="text-sm">排序号
                              <input type="number" min={0} step={1} value={editing.sort_order ?? 0} onChange={(e) => updateEditing((prev) => ({ ...prev, sort_order: Number(e.target.value || 0) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            </label>
                          ) : null}
                          {!isHomeHeroSlidesModule && !isHomeLatestTipsModule && !isExpertVoicesModule ? (
                            <label className="text-sm">状态
                              <select value={editing.status || 'draft'} onChange={(e) => updateEditing((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2">
                                <option value="draft">草稿</option>
                                <option value="published">已发布</option>
                              </select>
                            </label>
                          ) : null}
                          {!isHomeHeroSlidesModule && !isNewsLikeModule ? (
                            <label className="text-sm md:col-span-2">{currentModuleConfig?.summaryLabel || '摘要'}
                              <textarea rows={3} value={pickSimpleField(editing, currentModuleConfig.summaryField || 'summary')} onChange={(e) => updateEditing((prev) => ({ ...prev, [currentModuleConfig.summaryField || 'summary']: e.target.value }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            </label>
                          ) : null}
                          {isExpertVoicesModule ? (
                            <label className="text-sm md:col-span-2">主题标签（辅助信息）
                              <textarea
                                rows={3}
                                value={pickSimpleField(editing, 'topics_input', Array.isArray(editing.topics) ? editing.topics.join('、') : '')}
                                onChange={(e) => updateEditing((prev) => ({ ...prev, topics_input: e.target.value }))}
                                className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2"
                                placeholder="示例：中医妇科、产后调养、体质重建（支持逗号、顿号或换行）"
                              />
                              <div className="mt-1 text-xs text-[#6B7280]">支持用逗号、顿号或换行分隔多个标签。</div>
                            </label>
                          ) : null}
                          {currentModuleConfig.contentField && !isExpertVoicesModule ? (
                            <label className="text-sm md:col-span-2">{currentModuleConfig?.contentLabel || '正文（每行一段）'}
                              <textarea rows={6} value={toLines(editing[currentModuleConfig.contentField])} onChange={(e) => updateEditing((prev) => ({ ...prev, [currentModuleConfig.contentField]: fromLines(e.target.value) }))} className="mt-1 w-full rounded border border-[#E5C0C8] px-3 py-2" />
                            </label>
                          ) : null}
                        </div>
                        )
                      ) : (
                        <div className="mt-4">
                          <textarea rows={24} value={editingRaw} onChange={(e) => { setEditingRaw(e.target.value); }} className="w-full rounded border border-[#E5C0C8] p-3 font-mono text-xs" />
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2">
                        <button onClick={onSave} disabled={saving} className="rounded bg-[#194F92] px-4 py-2 text-white disabled:opacity-60">{saving ? '保存中...' : '保存'}</button>
                        <span className="text-xs text-[#6B7280]">已启用自动存草稿（每10秒）</span>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}

          {activeMenu === 'media' ? (
            <>
              <div className={cardStyle}>
                <h2 className="text-lg font-semibold">图片列表</h2>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-[#6B7280]">按文件夹筛选</span>
                  <select
                    value={mediaFolderFilter}
                    onChange={(e) => setMediaFolderFilter(e.target.value)}
                    className="rounded border border-[#E5C0C8] px-2 py-1 text-xs"
                  >
                    {mediaFolders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder === 'all' ? '全部文件夹' : (moduleByKey[folder]?.label || folder)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredMediaItems.map((item) => (
                    <div key={item.id} className="rounded border border-[#E8D8DD] p-2">
                      <img src={item.url} alt={item.name} className="h-24 w-full rounded object-cover" />
                      <div className="mt-1 line-clamp-1 text-xs">{item.name}</div>
                      <div className="mt-1 text-[11px] text-[#6B7280]">
                        文件夹：{moduleByKey[item.folder || item.moduleKey]?.label || item.folder || item.moduleKey || 'media-library'}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1 text-xs">
                        <button onClick={() => navigator.clipboard.writeText(item.url)} className="rounded border px-2 py-1">复制</button>
                        <button onClick={() => onCheckRefs(item)} className="rounded border px-2 py-1">引用</button>
                        <button onClick={() => onDeleteMedia(item)} className="rounded border border-red-200 px-2 py-1 text-red-600">删</button>
                      </div>
                    </div>
                  ))}
                </div>
                {mediaRefs.length ? (
                  <div className="mt-4 rounded border border-[#E8D8DD] bg-[#FAFAFC] p-3 text-xs">
                    <div className="font-semibold">引用位置</div>
                    <pre className="mt-2 overflow-auto whitespace-pre-wrap">{JSON.stringify(mediaRefs, null, 2)}</pre>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}

          {activeMenu === 'leads' ? (
            <>
              <div className={cardStyle}>
                <h2 className="text-lg font-semibold">公益家园报名</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <select value={leadFilter.type} onChange={(e) => setLeadFilter((prev) => ({ ...prev, type: e.target.value }))} className="rounded border border-[#E5C0C8] px-3 py-2 text-sm">
                    <option value="">全部类型</option>
                    <option value="charity">公益报名</option>
                    <option value="promo">项目咨询</option>
                  </select>
                  <select value={leadFilter.status} onChange={(e) => setLeadFilter((prev) => ({ ...prev, status: e.target.value }))} className="rounded border border-[#E5C0C8] px-3 py-2 text-sm">
                    <option value="">全部跟进状态</option>
                    <option value="new">新线索</option>
                    <option value="contacted">已联系</option>
                    <option value="closed">已关闭</option>
                  </select>
                  <input value={leadFilter.q} onChange={(e) => setLeadFilter((prev) => ({ ...prev, q: e.target.value }))} placeholder="关键词" className="rounded border border-[#E5C0C8] px-3 py-2 text-sm" />
                  <button onClick={() => { setSelectedLeadIds([]); refreshLeads(); }} className="rounded border border-[#E5C0C8] px-3 py-2 text-sm">查询</button>
                  <button onClick={toggleSelectAllLeads} className="rounded border border-[#E5C0C8] px-3 py-2 text-sm">
                    {allVisibleLeadsSelected ? '取消全选' : '全选'}
                  </button>
                  <button
                    onClick={onDeleteSelectedLeads}
                    disabled={!selectedVisibleLeadIds.length || batchDeletingLeads}
                    className="rounded border border-red-200 px-3 py-2 text-sm text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {batchDeletingLeads ? '删除中...' : `删除（${selectedVisibleLeadIds.length}）`}
                  </button>
                  <button onClick={() => exportLeadsCsv(leads)} className="rounded bg-[#194F92] px-3 py-2 text-sm text-white">导出CSV</button>
                </div>
              </div>

              <div className={cardStyle}>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[#6B7280]">
                        <th className="w-10">
                          <input type="checkbox" checked={allVisibleLeadsSelected} onChange={toggleSelectAllLeads} className="h-4 w-4" />
                        </th>
                        <th>时间</th>
                        <th>类型</th>
                        <th>姓名</th>
                        <th>手机</th>
                        <th>城市</th>
                        <th>内容</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((item) => (
                        <tr key={item.id} className="border-t border-[#F0E7EA]">
                          <td className="py-2">
                            <input
                              type="checkbox"
                              checked={selectedLeadIds.includes(String(item.id))}
                              onChange={(e) => toggleSelectLead(item.id, e.target.checked)}
                              className="h-4 w-4"
                            />
                          </td>
                          <td className="py-2">{item.createdAt?.slice(0, 19).replace('T', ' ')}</td>
                          <td>{item.leadType === 'charity' ? '公益报名' : (item.leadType === 'promo' ? '项目咨询' : item.leadType)}</td>
                          <td>{item.name}</td>
                          <td>{item.phone}</td>
                          <td>{item.city}</td>
                          <td className="max-w-[280px] truncate">{item.message || item.project || item.serviceSlug}</td>
                          <td>
                            <select value={item.followStatus || 'new'} onChange={(e) => onUpdateLeadStatus(item.id, e.target.value)} className="rounded border border-[#E5C0C8] px-2 py-1 text-xs">
                              <option value="new">新线索</option>
                              <option value="contacted">已联系</option>
                              <option value="closed">已关闭</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}

          {activeMenu === 'logs' ? (
            <div className={cardStyle}>
              <h2 className="text-lg font-semibold">操作日志</h2>
              <div className="mt-3 overflow-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-[#6B7280]"><th>时间</th><th>动作</th><th>模块</th><th>目标</th><th>详情</th></tr></thead>
                  <tbody>
                    {logs.map((item) => (
                      <tr key={item.id} className="border-t border-[#F0E7EA]"><td className="py-2">{item.created_at?.slice(0, 19).replace('T', ' ')}</td><td>{item.action}</td><td>{item.module}</td><td>{item.target_id}</td><td>{item.detail}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {activeMenu === 'settings' ? (
            <div className={cardStyle}>
              <h2 className="text-lg font-semibold">系统设置</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-[#E5C0C8] bg-white p-4">
                  <div className="text-sm font-medium text-[#1F2937]">显示模式</div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminUi((prev) => ({ ...prev, mode: 'day' }))}
                      className={`rounded border px-3 py-1.5 text-sm ${adminUi.mode === 'day' ? 'border-[#194F92] text-[#194F92]' : 'border-[#E5C0C8]'}`}
                    >
                      日用
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminUi((prev) => ({ ...prev, mode: 'night' }))}
                      className={`rounded border px-3 py-1.5 text-sm ${adminUi.mode === 'night' ? 'border-[#194F92] text-[#194F92]' : 'border-[#E5C0C8]'}`}
                    >
                      夜用
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border border-[#E5C0C8] bg-white p-4">
                  <div className="text-sm font-medium text-[#1F2937]">主题色</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {adminAccentOptions.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setAdminUi((prev) => ({ ...prev, accent: item.value }))}
                        className={`rounded border px-3 py-1.5 text-sm ${adminUi.accent === item.value ? 'border-[#194F92] text-[#194F92]' : 'border-[#E5C0C8]'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[#6B7280]">
                    <span>当前色</span>
                    <span className="inline-block h-4 w-10 rounded border border-[#E5C0C8]" style={{ backgroundColor: adminUi.accent }} />
                    <span>{adminUi.accent}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
