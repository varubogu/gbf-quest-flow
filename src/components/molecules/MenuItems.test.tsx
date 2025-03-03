import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuItems } from './MenuItems';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        newData: '新規作成',
        loadData: '読み込み',
        downloadData: 'ダウンロード',
        downloadOriginalData: '元データをダウンロード',
        edit: '編集',
        save: '保存',
        cancelEdit: '編集キャンセル',
        options: '設定',
        help: 'ヘルプ',
        loadingFile: '読み込み中...',
      };
      return translations[key] || key;
    },
  }),
}));

// ストアのモック
let mockFlowData = null;
let mockIsEditMode = false;

vi.mock('@/core/stores/flowStore', () => ({
  default: (selector) => selector({ flowData: mockFlowData }),
}));

vi.mock('@/core/stores/editModeStore', () => ({
  default: (selector) => selector({ isEditMode: mockIsEditMode }),
}));

// Lucide-reactのアイコンコンポーネントをモック
vi.mock('lucide-react', () => ({
  FileText: () => <div data-testid="icon-file-text">FileText</div>,
  FolderOpen: () => <div data-testid="icon-folder-open">FolderOpen</div>,
  Download: () => <div data-testid="icon-download">Download</div>,
  Edit2: () => <div data-testid="icon-edit">Edit2</div>,
  Save: () => <div data-testid="icon-save">Save</div>,
  XCircle: () => <div data-testid="icon-x-circle">XCircle</div>,
  Settings: () => <div data-testid="icon-settings">Settings</div>,
  HelpCircle: () => <div data-testid="icon-help-circle">HelpCircle</div>,
}));

describe('MenuItems', () => {
  const onItemClickMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFlowData = null;
    mockIsEditMode = false;
  });

  it('基本的なメニュー項目が表示されること', () => {
    render(<MenuItems onItemClick={onItemClickMock} />);

    // 基本的なメニュー項目が表示されていることを確認
    expect(screen.getByText('新規作成')).toBeInTheDocument();
    expect(screen.getByText('読み込み')).toBeInTheDocument();
    expect(screen.getByText('設定')).toBeInTheDocument();
    expect(screen.getByText('ヘルプ')).toBeInTheDocument();

    // flowDataがnullの場合、編集関連のメニューは表示されないことを確認
    expect(screen.queryByText('ダウンロード')).not.toBeInTheDocument();
    expect(screen.queryByText('編集')).not.toBeInTheDocument();
  });

  it('メニュー項目がクリックされたときにonItemClickが呼ばれること', () => {
    render(<MenuItems onItemClick={onItemClickMock} />);

    // 新規作成ボタンをクリック
    fireEvent.click(screen.getByText('新規作成'));
    expect(onItemClickMock).toHaveBeenCalledWith('new');

    // 読み込みボタンをクリック
    fireEvent.click(screen.getByText('読み込み'));
    expect(onItemClickMock).toHaveBeenCalledWith('load');
  });

  it('isLoadingがtrueの場合、読み込みボタンが無効化され、テキストが変更されること', () => {
    render(<MenuItems onItemClick={onItemClickMock} isLoading={true} />);

    // 読み込み中のテキストが表示されていることを確認
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();

    // 読み込みボタンが無効化されていることを確認
    const loadButton = screen.getByText('読み込み中...').closest('button');
    expect(loadButton).toBeDisabled();
  });

  it('flowDataが存在する場合、追加のメニュー項目が表示されること', () => {
    // flowDataを設定
    mockFlowData = { id: '1', name: 'Test Flow' };

    render(<MenuItems onItemClick={onItemClickMock} />);

    // flowDataが存在する場合の追加メニュー項目が表示されていることを確認
    expect(screen.getByText('ダウンロード')).toBeInTheDocument();
    expect(screen.getByText('編集')).toBeInTheDocument();

    // 編集モードでない場合、キャンセルボタンは表示されないことを確認
    expect(screen.queryByText('編集キャンセル')).not.toBeInTheDocument();
  });

  it('編集モードの場合、メニュー項目のテキストとアイコンが変更されること', () => {
    // flowDataとisEditModeを設定
    mockFlowData = { id: '1', name: 'Test Flow' };
    mockIsEditMode = true;

    render(<MenuItems onItemClick={onItemClickMock} />);

    // 編集モード時のテキスト変更を確認
    expect(screen.getByText('元データをダウンロード')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('編集キャンセル')).toBeInTheDocument();

    // 保存アイコンが表示されていることを確認
    expect(screen.getByTestId('icon-save')).toBeInTheDocument();
  });
});