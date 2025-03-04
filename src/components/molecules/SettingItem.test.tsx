import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingItem } from './SettingItem';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): {
    t: (_key: string) => string;
  } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        'settings.language': '言語設定',
        'settings.theme': 'テーマ設定',
      };
      return translations[key] || key;
    },
  }),
}));

describe('SettingItem', () => {
  it('ラベルが正しく表示されること', () => {
    render(
      <SettingItem labelKey="settings.language">
        <div>テスト子要素</div>
      </SettingItem>
    );

    // ラベルが表示されていることを確認
    expect(screen.getByText('言語設定')).toBeInTheDocument();
  });

  it('子要素が正しく表示されること', () => {
    render(
      <SettingItem labelKey="settings.theme">
        <div data-testid="child-element">テスト子要素</div>
      </SettingItem>
    );

    // 子要素が表示されていることを確認
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('テスト子要素')).toBeInTheDocument();
  });

  it('複数の子要素が正しく表示されること', () => {
    render(
      <SettingItem labelKey="settings.language">
        <div data-testid="child-element-1">子要素1</div>
        <div data-testid="child-element-2">子要素2</div>
      </SettingItem>
    );

    // 複数の子要素が表示されていることを確認
    expect(screen.getByTestId('child-element-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-element-2')).toBeInTheDocument();
    expect(screen.getByText('子要素1')).toBeInTheDocument();
    expect(screen.getByText('子要素2')).toBeInTheDocument();
  });

  it('スタイルが正しく適用されていること', () => {
    render(
      <SettingItem labelKey="settings.language">
        <div>テスト子要素</div>
      </SettingItem>
    );

    // 親要素のスタイルを確認
    const parentElement = screen.getByText('言語設定').closest('div');
    expect(parentElement).toHaveClass('mb-4');

    // ラベル要素のスタイルを確認
    const labelElement = screen.getByText('言語設定');
    expect(labelElement).toHaveClass('font-semibold');

    // 子要素のコンテナのスタイルを確認
    const childContainer = screen.getByText('テスト子要素').parentElement;
    expect(childContainer).toHaveClass('mt-2');
  });
});