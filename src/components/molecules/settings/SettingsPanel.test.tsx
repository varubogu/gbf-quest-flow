import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPanel } from './SettingsPanel';
import { vi } from 'vitest';

// モックの作成
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/stores/settingsStore', () => ({
  default: () => ({
    settings: {
      language: '日本語',
      buttonAlignment: '左',
      tablePadding: 4,
      actionTableClickType: 'single',
    },
    updateSettings: vi.fn(),
  }),
}));

describe('SettingsPanel', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all setting sections', () => {
    render(<SettingsPanel onBack={mockOnBack} />);

    // 各設定セクションが表示されていることを確認
    expect(screen.getByText('language')).toBeInTheDocument();
    expect(screen.getByText('buttonAlignment')).toBeInTheDocument();
    expect(screen.getByText('tablePadding')).toBeInTheDocument();
    expect(screen.getByText('actionTableClickType')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    render(<SettingsPanel onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('back'));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('renders back button with correct icon and text', () => {
    render(<SettingsPanel onBack={mockOnBack} />);
    const backButton = screen.getByRole('button');
    // ボタンの基本クラスをチェック
    expect(backButton).toHaveClass('mb-4');
    // 戻るテキストが含まれていることを確認
    expect(backButton).toContainElement(screen.getByText('back'));
    // アイコンが存在することを確認
    const icon = screen.getByRole('button').querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('w-4', 'h-4', 'mr-2');
  });
});