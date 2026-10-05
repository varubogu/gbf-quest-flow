/**
 * Cloudflare Pages Function: 公開 URL の行動表 JSON を取得するプロキシ。
 * バンドル制約を避けるため、ガード処理をこのファイルに閉じる。
 */

const MAX_FLOW_BYTES = 1_000_000;

interface PagesContext {
  request: Request;
}

function isPrivateIpv4(hostname: string): boolean {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const first = Number(match[1]);
  const second = Number(match[2]);
  if (first === 10 || first === 127 || first === 0) return true;
  if (first === 192 && second === 168) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 169 && second === 254) return true;
  return false;
}

function assertPublicHttpsUrl(raw: string): URL {
  const url = new URL(raw);
  if (url.protocol !== 'https:') {
    throw new Error('HTTPS_ONLY');
  }
  const host = url.hostname.toLowerCase();
  const blocked = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]',
    '169.254.169.254',
    'metadata.google.internal',
  ]);
  if (blocked.has(host) || host.endsWith('.localhost') || isPrivateIpv4(host)) {
    throw new Error('PRIVATE_HOST');
  }
  return url;
}

function rewriteCloudStorageUrl(raw: string): string {
  const url = new URL(raw);
  const host = url.hostname.toLowerCase();
  const driveFile = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (host.includes('drive.google.com') && driveFile?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveFile[1]}`;
  }
  const driveId = url.searchParams.get('id');
  if (host.includes('drive.google.com') && driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
  }
  if (host.includes('dropbox.com')) {
    url.searchParams.set('dl', '1');
    return url.toString();
  }
  return raw;
}

function isLikelyFlow(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.title === 'string' && Array.isArray(record.flow);
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  const target = requestUrl.searchParams.get('url');
  if (!target) {
    return Response.json({ error: 'MISSING_URL' }, { status: 400 });
  }

  try {
    assertPublicHttpsUrl(target);
    const rewritten = rewriteCloudStorageUrl(target);
    assertPublicHttpsUrl(rewritten);

    const response = await fetch(rewritten, {
      method: 'GET',
      redirect: 'follow',
      headers: { Accept: 'application/json,text/plain,*/*' },
    });
    if (!response.ok) {
      return Response.json({ error: 'FETCH_FAILED' }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_FLOW_BYTES) {
      return Response.json({ error: 'TOO_LARGE' }, { status: 413 });
    }

    const parsed: unknown = JSON.parse(new TextDecoder().decode(buffer));
    if (!isLikelyFlow(parsed)) {
      return Response.json({ error: 'INVALID_JSON' }, { status: 422 });
    }

    return Response.json(parsed, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN';
    const status = message === 'HTTPS_ONLY' || message === 'PRIVATE_HOST' ? 400 : 502;
    return Response.json({ error: message }, { status });
  }
}
