import { describe, it, expect, vi } from 'vitest';
import { fetchRemoteJson } from './fetchRemoteJson';

describe('fetchRemoteJson', () => {
  it('公開JSONを取得する', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => new TextEncoder().encode(JSON.stringify({ title: 't', flow: [] })),
    });

    const result = await fetchRemoteJson(
      'https://example.com/flow.json',
      fetcher as unknown as typeof fetch
    );
    expect(result.ok).toBe(true);
    expect(result.body).toEqual({ title: 't', flow: [] });
  });

  it('HTTPを拒否する', async () => {
    const result = await fetchRemoteJson('http://example.com/flow.json');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('HTTPS_ONLY');
  });

  it('フロー形式でないJSONを拒否する', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => new TextEncoder().encode(JSON.stringify({ foo: 1 })),
    });
    const result = await fetchRemoteJson(
      'https://example.com/flow.json',
      fetcher as unknown as typeof fetch
    );
    expect(result.ok).toBe(false);
    expect(result.error).toBe('INVALID_JSON');
  });
});
