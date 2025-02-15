import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlowLayout } from './FlowLayout';
import { renderWithI18n } from '@/test/i18n-test-utils';

// react-resizable-panelsのモック
vi.mock('react-resizable-panels', () => ({
  Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PanelGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PanelResizeHandle: () => <div data-testid="resize-handle" />,
  ImperativePanelHandle: vi.fn(),
}));

// モーダルコンポーネントのモック
vi.mock('@/components/organisms/OrganizationModal', () => ({
  OrganizationModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>ジョブ、キャラ、アビリティ</div> : null,
}));

vi.mock('@/components/organisms/InfoModal', () => ({
  InfoModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>その他の情報</div> : null,
}));

const mockFlowData = {
  title: 'テストフロー',
  quest: 'テストクエスト',
  author: 'テスト作者',
  description: 'テスト説明',
  updateDate: '2024-01-01',
  note: 'テストノート',
  organization: {
    job: { name: '', note: '', equipment: { name: '', note: '' }, abilities: [] },
    member: { front: [], back: [] },
    weapon: {
      main: { name: '', note: '', additionalSkill: '' },
      other: [],
      additional: []
    },
    weaponEffects: { taRate: '', hp: '', defense: '' },
    summon: {
      main: { name: '', note: '' },
      friend: { name: '', note: '' },
      other: [],
      sub: []
    },
    totalEffects: { taRate: '', hp: '', defense: '' }
  },
  always: 'テストメモ',
  flow: []
};

describe('FlowLayout', () => {
  const mockHandlers = {
    onSave: vi.fn(),
    onTitleChange: vi.fn(),
    onAlwaysChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('表示モードでタイトルとメモが表示される', () => {
    renderWithI18n(
      <FlowLayout
        flowData={mockFlowData}
        isEditMode={false}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('テストフロー')).toBeInTheDocument();
    expect(screen.getByText('テストメモ')).toBeInTheDocument();
  });

  it('編集モードでタイトルとメモが編集可能', () => {
    renderWithI18n(
      <FlowLayout
        flowData={mockFlowData}
        isEditMode={true}
        {...mockHandlers}
      />
    );

    const titleInput = screen.getByDisplayValue('テストフロー');
    const memoTextarea = screen.getByDisplayValue('テストメモ');

    expect(titleInput).toBeInTheDocument();
    expect(memoTextarea).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: '新しいタイトル' } });
    fireEvent.change(memoTextarea, { target: { value: '新しいメモ' } });

    expect(mockHandlers.onTitleChange).toHaveBeenCalled();
    expect(mockHandlers.onAlwaysChange).toHaveBeenCalled();
  });

  it('メモの開閉ボタンが存在する', () => {
    renderWithI18n(
      <FlowLayout
        flowData={mockFlowData}
        isEditMode={false}
        {...mockHandlers}
      />
    );

    const toggleButton = screen.getByText('メモ開閉');
    expect(toggleButton).toBeInTheDocument();
  });

  it('各モーダルが開閉できる', () => {
    renderWithI18n(
      <FlowLayout
        flowData={mockFlowData}
        isEditMode={false}
        {...mockHandlers}
      />
    );

    const organizationButton = screen.getByText('編成確認');
    const infoButton = screen.getByLabelText('その他の情報');

    fireEvent.click(organizationButton);
    expect(screen.getByText('ジョブ、キャラ、アビリティ')).toBeInTheDocument();

    fireEvent.click(infoButton);
    expect(screen.getByText('その他の情報')).toBeInTheDocument();
  });
});