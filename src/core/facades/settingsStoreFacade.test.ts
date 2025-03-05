import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AppSettings } from '@/types/settings';
import { settingsStoreService } from '@/core/services/settingsStoreService';
import { updateSettings } from './settingsStoreFacade';

// serviceのモック設定
vi.mock('@/core/services/settingsStoreService', () => ({
  settingsStoreService: {
    updateSettings: vi.fn(),
  },
}));

// storeのモック設定
vi.mock('@/core/stores/settingsStore', () => {
  const mockSettings = {
    language: '日本語',
    buttonAlignment: 'right',
    tablePadding: 8,
    actionTableClickType: 'double',
  };

  return {
    default: vi.fn((selector) => {
      if (selector) {
        return selector({ settings: mockSettings });
      }
      return { settings: mockSettings };
    }),
  };
});

describe('settingsStoreFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updateSettingsを呼び出すとserviceのupdateSettingsが呼ばれること', () => {
    const newSettings: Partial<AppSettings> = { language: 'English' };

    updateSettings(newSettings);

    expect(settingsStoreService.updateSettings).toHaveBeenCalledWith(newSettings);
  });
});
