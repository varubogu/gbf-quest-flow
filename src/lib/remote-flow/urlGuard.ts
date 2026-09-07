const MAX_FLOW_BYTES = 1_000_000;

/**
 * プライベートIPv4かどうかを判定する。
 */
export function isPrivateIpv4(hostname: string): boolean {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) {
    return false;
  }
  const first = Number(match[1]);
  const second = Number(match[2]);
  if (first === 10 || first === 127 || first === 0) {
    return true;
  }
  if (first === 192 && second === 168) {
    return true;
  }
  if (first === 172 && second >= 16 && second <= 31) {
    return true;
  }
  if (first === 169 && second === 254) {
    return true;
  }
  return false;
}

/**
 * ブラウザから到達してよい公開HTTPS URLだけを許可する。
 */
export function assertPublicHttpsUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('INVALID_URL');
  }

  if (url.protocol !== 'https:') {
    throw new Error('HTTPS_ONLY');
  }

  const host = url.hostname.toLowerCase();
  const blockedHosts = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]',
    '169.254.169.254',
    'metadata.google.internal',
  ]);

  if (blockedHosts.has(host) || host.endsWith('.localhost') || isPrivateIpv4(host)) {
    throw new Error('PRIVATE_HOST');
  }

  return url;
}

/**
 * 共有リンクを直接ダウンロード可能な URL に正規化する。
 */
export function rewriteCloudStorageUrl(raw: string): string {
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

/**
 * Content Layer 用の記事IDを安全な相対パスにする。
 */
export function sanitizeContentId(dataId: string): string {
  const trimmed = dataId.trim();
  if (!trimmed || trimmed.includes('..') || trimmed.startsWith('/') || trimmed.includes('\\')) {
    throw new Error('INVALID_CONTENT_ID');
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/.test(trimmed)) {
    throw new Error('INVALID_CONTENT_ID');
  }
  return trimmed.replace(/\.json$/i, '');
}

export { MAX_FLOW_BYTES };
