import { describe, it, expect, vi, beforeEach } from 'vitest';
import useSettingsStoreFacade from './settingsStoreFacade';
import useSettingsStore from '@/core/stores/settingsStore';

// モック
vi.mock('@/core/stores/settingsStore', () => ({
  default: {
    getState: vi.fn(),
    subscribe: vi.fn(() => vi.fn()), // unsubscribe関数を返す
  },
}));

describe('settingsStoreFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // モックの初期化
    const mockSettings = {
      language: '日本語',
      buttonAlignment: 'right',
      tablePadding: 8,
      actionTableClickType: 'double',
    };

    const mockUpdateSettings = vi.fn();

    (useSettingsStore.getState as any).mockReturnValue({
      settings: mockSettings,
      updateSettings: mockUpdateSettings,
    });
  });

  it('should initialize with settings from settingsStore', () => {
    const facade = useSettingsStoreFacade.getState();
    expect(facade.settings).toEqual({
      language: '日本語',
      buttonAlignment: 'right',
      tablePadding: 8,
      actionTableClickType: 'double',
    });
  });

  it('should call updateSettings on the original store', () => {
    const facade = useSettingsStoreFacade.getState();
    const mockUpdateSettings = useSettingsStore.getState().updateSettings;

    const newSettings = { language: 'English' };
    facade.updateSettings(newSettings);

    expect(mockUpdateSettings).toHaveBeenCalledWith(newSettings);
  });

  it('should subscribe to the original store', () => {
    expect(useSettingsStore.subscribe).toHaveBeenCalled();
  });
});
