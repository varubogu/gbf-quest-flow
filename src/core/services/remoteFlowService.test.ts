import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchFlowFromQuery } from './remoteFlowService';

const validFlow = {
  title: 't',
  quest: '',
  author: '',
  description: '',
  updateDate: '',
  note: '',
  always: '',
  flow: [],
  organization: {
    job: { key: '', name: '', note: '', equipment: { name: '', note: '' }, abilities: [] },
    member: { front: [], back: [] },
    weapon: {
      main: { key: '', name: '', note: '', additionalSkill: '' },
      other: [],
      additional: [],
    },
    weaponEffects: {},
    totalEffects: {},
    summon: {
      main: { key: '', name: '', note: '' },
      friend: { key: '', name: '', note: '' },
      other: [],
      sub: [],
    },
  },
};

describe('remoteFlowService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('?d= からコンテンツを読む', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => validFlow,
      })
    );
    const flow = await fetchFlowFromQuery({ dataId: 'sample', remoteUrl: null });
    expect(flow.title).toBe('t');
    expect(fetch).toHaveBeenCalledWith('/content/flows/sample.json');
  });

  it('?url= はプロキシ経由で読む', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => validFlow,
      })
    );
    await fetchFlowFromQuery({ dataId: null, remoteUrl: 'https://example.com/a.json' });
    expect(fetch).toHaveBeenCalledWith('/api/fetch-flow?url=https%3A%2F%2Fexample.com%2Fa.json');
  });
});
