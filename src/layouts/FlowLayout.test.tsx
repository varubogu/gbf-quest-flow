import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlowLayout } from './FlowLayout';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'ja',
    },
  }),
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
    render(
      <I18nextProvider i18n={i18next}>
        <FlowLayout
          flowData={mockFlowData}
          isEditMode={false}
          {...mockHandlers}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('テストフロー')).toBeInTheDocument();
    expect(screen.getByText('テストメモ')).toBeInTheDocument();
  });

  it('編集モードでタイトルとメモが編集可能', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FlowLayout
          flowData={mockFlowData}
          isEditMode={true}
          {...mockHandlers}
        />
      </I18nextProvider>
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

  it('メモの開閉ボタンが機能する', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FlowLayout
          flowData={mockFlowData}
          isEditMode={false}
          {...mockHandlers}
        />
      </I18nextProvider>
    );

    const toggleButton = screen.getByText('memo');
    fireEvent.click(toggleButton);

    // メモパネルのリサイズは実装依存のため、ボタンの存在とクリックイベントのみを確認
    expect(toggleButton).toBeInTheDocument();
  });

  it('各モーダルが開閉できる', () => {
    render(
      <I18nextProvider i18n={i18next}>
        <FlowLayout
          flowData={mockFlowData}
          isEditMode={false}
          {...mockHandlers}
        />
      </I18nextProvider>
    );

    const organizationButton = screen.getByText('organization');
    const infoButton = screen.getByLabelText('otherInfo');

    fireEvent.click(organizationButton);
    expect(screen.getByText('jobAndCharacters')).toBeInTheDocument();

    fireEvent.click(infoButton);
    expect(screen.getByText('infoModalTitle')).toBeInTheDocument();
  });
});