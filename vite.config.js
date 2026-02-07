import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import { appendFile } from 'fs/promises';
import { devLogger } from '@meituan-nocode/vite-plugin-dev-logger';
import {
  devHtmlTransformer,
  prodHtmlTransformer,
} from '@meituan-nocode/vite-plugin-nocode-html-transformer';
import react from '@vitejs/plugin-react';

const CHAT_VARIABLE = process.env.CHAT_VARIABLE || '';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '';

const isProdEnv = process.env.NODE_ENV === 'production';
const publicPath = (isProdEnv && CHAT_VARIABLE)
  ? PUBLIC_PATH + '/' + CHAT_VARIABLE
  : PUBLIC_PATH + '/';
const outDir = (isProdEnv && CHAT_VARIABLE) ? 'build/' + CHAT_VARIABLE : 'build';

const charitySubmissionFile = join(tmpdir(), 'nocode-charity-participation.jsonl');
const promoInquirySubmissionFile = join(tmpdir(), 'nocode-promo-inquiry.jsonl');

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
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

const handleCharityParticipation = async (req, res, next) => {
  if (req.url !== '/api/charity-participation' || req.method !== 'POST') {
    return next();
  }

  try {
    const body = await readJsonBody(req);
    if (!body?.name || !body?.phone || !body?.city || !body?.project) {
      sendJson(res, 400, { success: false, message: '缺少必填字段。' });
      return;
    }

    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...body
    };
    await appendFile(charitySubmissionFile, `${JSON.stringify(record)}\n`, 'utf8');

    sendJson(res, 200, { success: true, data: record });
  } catch (error) {
    sendJson(res, 500, { success: false, message: '服务异常，请稍后重试。' });
  }
};

const handlePromoInquiry = async (req, res, next) => {
  if (req.url !== '/api/promo-inquiry' || req.method !== 'POST') {
    return next();
  }

  try {
    const body = await readJsonBody(req);
    if (!body?.name || !body?.phone || !body?.city || !body?.serviceSlug || !body?.categorySlug) {
      sendJson(res, 400, { success: false, message: '缺少必填字段。' });
      return;
    }

    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...body
    };
    await appendFile(promoInquirySubmissionFile, `${JSON.stringify(record)}\n`, 'utf8');
    sendJson(res, 200, { success: true, data: record });
  } catch (error) {
    sendJson(res, 500, { success: false, message: '服务异常，请稍后重试。' });
  }
};

const charityParticipationApiPlugin = () => ({
  name: 'charity-participation-api',
  configureServer(server) {
    server.middlewares.use(handleCharityParticipation);
    server.middlewares.use(handlePromoInquiry);
  },
  configurePreviewServer(server) {
    server.middlewares.use(handleCharityParticipation);
    server.middlewares.use(handlePromoInquiry);
  },
});

async function loadPlugins() {
  const plugins = isProdEnv
  ? CHAT_VARIABLE
    ? [react(), prodHtmlTransformer(CHAT_VARIABLE), charityParticipationApiPlugin()]
    : [react(), charityParticipationApiPlugin()]
  : [
      devLogger({
        dirname: resolve(tmpdir(), '.nocode-dev-logs'),
        maxFiles: '3d',
      }),
      react(),
      devHtmlTransformer(CHAT_VARIABLE),
      charityParticipationApiPlugin(),
    ];

  if (process.env.NOCODE_COMPILER_PATH) {
    const { componentCompiler } = await import(process.env.NOCODE_COMPILER_PATH);
    plugins.push(componentCompiler());
  }
  return plugins;
}

// https://vitejs.dev/config/
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
