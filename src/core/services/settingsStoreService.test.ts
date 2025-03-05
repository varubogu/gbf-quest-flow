import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AppSettings } from '@/types/settings';
import { SettingsStoreService } from './settingsStoreService';
import useSettingsStore from '@/core/stores/settingsStore';
import i18n from '@/lib/i18n';

describe('SettingsStoreService', () => {
  let service: SettingsStoreService;
  let mockI18nChangeLanguage: ReturnType<typeof vi.fn>;
  let mockUpdateSettings: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // モックの設定
    mockI18nChangeLanguage = vi.fn(async () => {});
    vi.spyOn(i18n, 'changeLanguage').mockImplementation(mockI18nChangeLanguage);

    mockUpdateSettings = vi.fn();
    vi.spyOn(useSettingsStore.getState(), 'updateSettings').mockImplementation(mockUpdateSettings);

    vi.spyOn(useSettingsStore, 'getState').mockReturnValue({
      settings: {
        language: '日本語',
        buttonAlignment: 'right',
        tablePadding: 8,
        actionTableClickType: 'double',
      },
      updateSettings: mockUpdateSettings,
    });

    service = new SettingsStoreService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('updateSettings', () => {
    it('言語が変更された場合、i18nの言語も変更されること', async () => {
      // Arrange
      const newSettings: Partial<AppSettings> = {
        language: 'English',
      };

      // Act
      await service.updateSettings(newSettings);

      // Assert
      expect(mockI18nChangeLanguage).toHaveBeenCalledWith('en');
      expect(mockUpdateSettings).toHaveBeenCalledWith(newSettings);
    });

    it('言語が変更されない場合、i18nの言語は変更されないこと', async () => {
      // Arrange
      const newSettings: Partial<AppSettings> = {
        buttonAlignment: 'left',
      };

      // Act
      await service.updateSettings(newSettings);

      // Assert
      expect(mockI18nChangeLanguage).not.toHaveBeenCalled();
      expect(mockUpdateSettings).toHaveBeenCalledWith(newSettings);
    });

    it('現在の言語と同じ言語に変更する場合、i18nの言語は変更されないこと', async () => {
      // Arrange
      const newSettings: Partial<AppSettings> = {
        language: '日本語',
      };

      // Act
      await service.updateSettings(newSettings);

      // Assert
      expect(mockI18nChangeLanguage).not.toHaveBeenCalled();
      expect(mockUpdateSettings).toHaveBeenCalledWith(newSettings);
    });
  });
});