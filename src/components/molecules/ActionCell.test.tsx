import { render, fireEvent } from '@testing-library/react';
import { ActionCell } from './ActionCell';
import useSettingsStore from '@/stores/settingsStore';

// モックの設定
jest.mock('@/stores/settingsStore');

describe('ActionCell', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSettingsStore as jest.Mock).mockReturnValue({
      settings: {
        actionTableClickType: 'double',
      },
    });
  });

  it('シングルクリック設定の場合、1回のクリックで選択される', () => {
    (useSettingsStore as jest.Mock).mockReturnValue({
      settings: {
        actionTableClickType: 'single',
      },
    });

    const { getByText } = render(
      <ActionCell content="テストセル" onChange={mockOnChange} />
    );

    fireEvent.click(getByText('テストセル'));
    expect(mockOnChange).toHaveBeenCalledWith('テストセル');
  });

  it('シングルクリック設定の場合、ダブルクリックは無視される', () => {
    (useSettingsStore as jest.Mock).mockReturnValue({
      settings: {
        actionTableClickType: 'single',
      },
    });

    const { getByText } = render(
      <ActionCell content="テストセル" onChange={mockOnChange} />
    );

    fireEvent.doubleClick(getByText('テストセル'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('ダブルクリック設定の場合、ダブルクリックで選択される', () => {
    const { getByText } = render(
      <ActionCell content="テストセル" onChange={mockOnChange} />
    );

    fireEvent.doubleClick(getByText('テストセル'));
    expect(mockOnChange).toHaveBeenCalledWith('テストセル');
  });

  it('ダブルクリック設定の場合、シングルクリックは無視される', () => {
    const { getByText } = render(
      <ActionCell content="テストセル" onChange={mockOnChange} />
    );

    fireEvent.click(getByText('テストセル'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('編集モードの場合、クリックで編集状態になる', () => {
    const { getByRole } = render(
      <ActionCell content="テストセル" isEditable onChange={mockOnChange} />
    );

    fireEvent.click(getByRole('textbox'));
    expect(getByRole('textbox')).toBeInTheDocument();
  });
});