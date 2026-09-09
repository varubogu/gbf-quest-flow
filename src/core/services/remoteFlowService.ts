import { flowSchema, type Flow } from '@/types/models';
import { sanitizeContentId } from '@/lib/remote-flow/urlGuard';

export interface RemoteFlowQuery {
  remoteUrl: string | null;
  dataId: string | null;
}

/**
 * クエリから行動表 JSON を読み込む。
 */
export async function fetchFlowFromQuery(query: RemoteFlowQuery): Promise<Flow> {
  if (query.dataId) {
    const safeId = sanitizeContentId(query.dataId);
    const response = await fetch(`/content/flows/${safeId}.json`);
    if (!response.ok) {
      throw new Error('CONTENT_NOT_FOUND');
    }
    const json: unknown = await response.json();
    return flowSchema.parse(json);
  }

  if (query.remoteUrl) {
    const response = await fetch(`/api/fetch-flow?url=${encodeURIComponent(query.remoteUrl)}`);
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error ?? 'FETCH_FAILED');
    }
    const json: unknown = await response.json();
    return flowSchema.parse(json);
  }

  throw new Error('MISSING_SOURCE');
}
