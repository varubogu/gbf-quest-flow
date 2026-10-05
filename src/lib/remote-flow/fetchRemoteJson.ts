import { assertPublicHttpsUrl, rewriteCloudStorageUrl, MAX_FLOW_BYTES } from './urlGuard';

export interface RemoteFlowFetchResult {
  ok: boolean;
  status: number;
  body: unknown;
  error?: string;
}

/**
 * 公開 URL から JSON を取得する。Cloudflare Pages Function と開発サーバで共用する。
 */
export async function fetchRemoteJson(
  rawUrl: string,
  fetcher: typeof fetch = fetch
): Promise<RemoteFlowFetchResult> {
  try {
    assertPublicHttpsUrl(rawUrl);
    const target = rewriteCloudStorageUrl(rawUrl);
    assertPublicHttpsUrl(target);

    const response = await fetcher(target, {
      method: 'GET',
      redirect: 'follow',
      headers: { Accept: 'application/json,text/plain,*/*' },
    });

    if (!response.ok) {
      return { ok: false, status: response.status, body: null, error: 'FETCH_FAILED' };
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_FLOW_BYTES) {
      return { ok: false, status: 413, body: null, error: 'TOO_LARGE' };
    }

    const text = new TextDecoder().decode(buffer);
    const parsed: unknown = JSON.parse(text);
    if (!isLikelyFlow(parsed)) {
      return { ok: false, status: 422, body: null, error: 'INVALID_JSON' };
    }

    return { ok: true, status: 200, body: parsed };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN';
    const status =
      message === 'HTTPS_ONLY' || message === 'PRIVATE_HOST' || message === 'INVALID_URL'
        ? 400
        : 502;
    return { ok: false, status, body: null, error: message };
  }
}

function isLikelyFlow(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.title === 'string' && Array.isArray(record.flow);
}
