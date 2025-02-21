import { render, screen } from '@testing-library/react';
import { WeaponPanel } from './index';
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
      other: [
        {
          name: 'その他武器1',
          additionalSkill: 'その他スキル1',
          note: 'その他ノート1',
        },
      ],
      additional: [
        {
          name: '追加武器1',
          additionalSkill: '追加スキル1',
          note: '追加ノート1',
        },
      ],
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
  })),
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

    // メイン武器の確認
    expect(screen.getByText('テスト武器')).toBeDefined();
    expect(screen.getByText('テストスキル')).toBeDefined();
    expect(screen.getByText('テストノート')).toBeDefined();

    // その他武器の確認
    expect(screen.getByText('その他武器1')).toBeDefined();
    expect(screen.getByText('その他スキル1')).toBeDefined();
    expect(screen.getByText('その他ノート1')).toBeDefined();

    // 追加武器の確認
    expect(screen.getByText('追加武器1')).toBeDefined();
    expect(screen.getByText('追加スキル1')).toBeDefined();
    expect(screen.getByText('追加ノート1')).toBeDefined();

    // スキル効果の確認
    expect(screen.getByText('50%')).toBeDefined();
    expect(screen.getByText('3000')).toBeDefined();
    expect(screen.getByText('10%')).toBeDefined();
  });

  it('編集モードで入力フィールドが表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <WeaponPanel isEditing={true} />
      </I18nextProvider>
    );

    // メイン武器の入力フィールド確認
    expect(screen.getByDisplayValue('テスト武器')).toBeDefined();
    expect(screen.getByDisplayValue('テストスキル')).toBeDefined();
    expect(screen.getByDisplayValue('テストノート')).toBeDefined();

    // その他武器の入力フィールド確認
    expect(screen.getByDisplayValue('その他武器1')).toBeDefined();
    expect(screen.getByDisplayValue('その他スキル1')).toBeDefined();
    expect(screen.getByDisplayValue('その他ノート1')).toBeDefined();

    // 追加武器の入力フィールド確認
    expect(screen.getByDisplayValue('追加武器1')).toBeDefined();
    expect(screen.getByDisplayValue('追加スキル1')).toBeDefined();
    expect(screen.getByDisplayValue('追加ノート1')).toBeDefined();

    // スキル効果の入力フィールド確認
    expect(screen.getByDisplayValue('50%')).toBeDefined();
    expect(screen.getByDisplayValue('3000')).toBeDefined();
    expect(screen.getByDisplayValue('10%')).toBeDefined();
  });
});