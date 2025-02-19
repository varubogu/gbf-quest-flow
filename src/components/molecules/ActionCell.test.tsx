import { render } from '@testing-library/react';
import { ActionCell } from './ActionCell';
import useSettingsStore from '@/stores/settingsStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';

// モックの設定
vi.mock('@/stores/settingsStore');
vi.mock('@/hooks/useActionCellState', () => ({
  useActionCellState: () => ({
    isEditing: true,
    setIsEditing: vi.fn(),
    value: 'テストセル',
    setValue: vi.fn(),
    textareaRef: { current: null },
    adjustTextareaHeight: vi.fn(),
  }),
}));

describe('ActionCell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSettingsStore as unknown as Mock).mockReturnValue({
      settings: {
        actionTableClickType: 'double',
      },
    });
  });

  it('基本的なコンテンツをレンダリングすること', () => {
    const { getByText } = render(
      <ActionCell content="テストセル" />
    );
    expect(getByText('テストセル')).toBeInTheDocument();
  });

  it('編集モードでテキストエリアをレンダリングすること', () => {
    const { getByRole } = render(
      <ActionCell content="テストセル" isEditable />
    );
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('ヘッダーセルとして適切にレンダリングすること', () => {
    const { container } = render(
      <ActionCell content="ヘッダー" isHeader />
    );
    expect(container.firstChild).toHaveClass('bg-muted');
    expect(container.firstChild).toHaveClass('font-medium');
  });
});