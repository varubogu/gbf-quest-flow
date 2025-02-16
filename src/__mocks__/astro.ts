import { vi } from 'vitest';
import { z } from 'zod';

export { z };

export const getCollection = vi.fn();
export const getEntry = vi.fn();
export const getEntries = vi.fn();
export const getEntryBySlug = vi.fn();

// astro:contentのモック
vi.mock('astro:content', () => ({
  z,
  getCollection,
  getEntry,
  getEntries,
  getEntryBySlug,
}));

// デフォルトのモック実装
getCollection.mockResolvedValue([]);
getEntry.mockResolvedValue(null);
getEntries.mockResolvedValue([]);
getEntryBySlug.mockResolvedValue(null);
