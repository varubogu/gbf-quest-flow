import { render, screen } from '@testing-library/react';
import { WeaponPanel } from './WeaponPanel';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import useFlowStore from '@/stores/flowStore';
import { describe, it, beforeEach, expect, vi } from 'vitest';

// モックデータ
const mockFlowData = {
  organization: {
    weapon: {
      main: {
        name: 'テスト武器',
        additionalSkill: 'テストスキル',
        note: 'テストノート',
      },
      other: [],
      additional: [],
    },
    weaponEffects: {
      taRate: '50%',
      hp: '3000',
      defense: '10%',
    },
  },
};

// Vitestでのモック設定
vi.mock('@/stores/flowStore', () => ({
  default: vi.fn(() => ({
    flowData: mockFlowData,
    updateFlowData: vi.fn(),
  }))
}));

describe('WeaponPanel', () => {
  beforeEach(() => {
    vi.mocked(useFlowStore).mockImplementation(() => ({
      flowData: mockFlowData,
      updateFlowData: vi.fn(),
    }));
  });

  it('表示モードで正しくデータが表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <WeaponPanel isEditing={false} />
      </I18nextProvider>
    );

    expect(screen.getByText('テスト武器')).toBeDefined();
    expect(screen.getByText('テストスキル')).toBeDefined();
    expect(screen.getByText('テストノート')).toBeDefined();
  });

  it('編集モードで入力フィールドが表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <WeaponPanel isEditing={true} />
      </I18nextProvider>
    );

    expect(screen.getByDisplayValue('テスト武器')).toBeDefined();
    expect(screen.getByDisplayValue('テストスキル')).toBeDefined();
    expect(screen.getByDisplayValue('テストノート')).toBeDefined();
  });
});