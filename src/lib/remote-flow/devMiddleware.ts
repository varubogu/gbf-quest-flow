import type { Connect } from 'vite';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fetchRemoteJson } from './fetchRemoteJson';
import { sanitizeContentId } from './urlGuard';

/**
 * 開発サーバ用: /api/fetch-flow と /content/flows を提供する。
 */
export function createRemoteFlowDevMiddleware(rootDir: string): Connect.NextHandleFunction {
  return async (req, res, next) => {
    try {
      const rawUrl = req.url ?? '';
      const pathname = rawUrl.split('?')[0] ?? '';

      if (pathname === '/api/fetch-flow') {
        const requestUrl = new URL(rawUrl, 'http://localhost');
        const target = requestUrl.searchParams.get('url');
        if (!target) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'MISSING_URL' }));
          return;
        }
        const result = await fetchRemoteJson(target);
        res.statusCode = result.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.ok ? result.body : { error: result.error }));
        return;
      }

      if (pathname.startsWith('/content/flows/')) {
        const relative = decodeURIComponent(pathname.replace('/content/flows/', ''));
        const safeId = sanitizeContentId(relative.replace(/\.json$/i, ''));
        const filePath = path.join(rootDir, 'src/content/flows', `${safeId}.json`);
        const json = await readFile(filePath, 'utf8');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(json);
        return;
      }
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'NOT_FOUND' }));
      return;
    }

    next();
  };
}
