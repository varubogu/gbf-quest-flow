import { render, screen, fireEvent } from '@testing-library/react';
import { SkillTable } from './SkillTable';
import type { WeaponSkillEffect } from '@/types/types';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { describe, it, beforeEach, expect, vi } from 'vitest';

// テスト対象の項目構成を固定するため、設定ファイルをモック化する
vi.mock('@/content/settings/skillEffects.json', () => ({
  default: {
    fields: [
      { key: 'taRate', type: 'percentage' },
      { key: 'hp', type: 'percentage' },
      { key: 'defense', type: 'add' },
    ],
  },
}));

// i18nの設定をモック化
i18n.use(initReactI18next).init({
  lng: 'ja',
  resources: {
    ja: {
      translation: {
        skill: 'スキル',
        effectAmount: '効果量',
        skillEffectNote: '備考',
        skillEffects: 'スキル効果量',
        totalAmount: 'スキル総合値',
        skill_taRate: 'TA率',
        skill_hp: '守護',
        skill_defense: '防御力',
        selectSkillToAdd: '追加するスキルを選択',
        removeSkillEffect: 'この項目を削除',
        noMoreSkillEffectsToAdd: '追加できる項目がありません',
      },
    },
  },
});

describe('SkillTable', () => {
  const mockValues: WeaponSkillEffect = {
    taRate: '50',
    hp: '3000',
    defense: '10',
  };
  const mockNotes: WeaponSkillEffect = {
    taRate: 'メモA',
    hp: '',
    defense: 'メモC',
  };

  const mockOnChange = vi.fn();
  const mockOnNoteChange = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnNoteChange.mockClear();
    mockOnRemove.mockClear();
    window.scrollTo = vi.fn();
  });

  it('表示モードで正しくデータが表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={mockValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    // ヘッダーの検証
    expect(screen.getByText('スキル')).toBeDefined();
    expect(screen.getByText('効果量')).toBeDefined();
    expect(screen.getByText('備考')).toBeDefined();
    expect(screen.getByText('スキル効果量')).toBeDefined();

    // 効果量の検証(割合は末尾に%、加算は先頭に+が自動付与される)
    expect(screen.getByText('50%')).toBeDefined();
    expect(screen.getByText('3000%')).toBeDefined();
    expect(screen.getByText('+10')).toBeDefined();

    // 備考の検証
    expect(screen.getByText('メモA')).toBeDefined();
    expect(screen.getByText('メモC')).toBeDefined();
  });

  it('表示モードでマイナス値はそのまま表示される(符号を追加しない)', () => {
    const negativeValues: WeaponSkillEffect = {
      taRate: '-50',
      hp: '3000',
      defense: '-10',
    };

    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={negativeValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    // 割合のマイナスは符号そのまま+%
    expect(screen.getByText('-50%')).toBeDefined();
    // 加算のマイナスはそのまま(+は付与されない)
    expect(screen.getByText('-10')).toBeDefined();
    expect(screen.queryByText('+-10')).not.toBeInTheDocument();
  });

  it('編集モードで効果量・備考それぞれの入力が正しく動作する', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={true}
          titleKey="skillEffects"
          values={mockValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const taRateInput = screen.getByTestId('skill-taRate-value');
    fireEvent.change(taRateInput, { target: { value: '60%' } });
    expect(mockOnChange).toHaveBeenCalledWith('taRate', '60%');

    const taRateNote = screen.getByTestId('skill-taRate-note');
    fireEvent.change(taRateNote, { target: { value: '変更後のメモ' } });
    expect(mockOnNoteChange).toHaveBeenCalledWith('taRate', '変更後のメモ');
  });

  it('割合(percentage)タイプの編集時は単位「%」が表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={true}
          titleKey="skillEffects"
          values={mockValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const taRateRow = screen.getByTestId('skill-taRate-value').closest('tr');
    expect(taRateRow).toHaveTextContent('%');
  });

  it('加算(add)タイプの編集時は単位が表示されない', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={true}
          titleKey="skillEffects"
          values={mockValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const defenseValueCell = screen.getByTestId('skill-defense-value').closest('td');
    expect(defenseValueCell).not.toHaveTextContent('%');
  });

  it('加算(add)タイプの編集時、符号なしの値には「+」が表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={true}
          titleKey="skillEffects"
          values={mockValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const defenseValueCell = screen.getByTestId('skill-defense-value').closest('td');
    expect(defenseValueCell).toHaveTextContent('+');
  });

  it('加算(add)タイプの編集時、マイナス値には「+」が追加されない', () => {
    const negativeValues: WeaponSkillEffect = {
      taRate: '50',
      hp: '3000',
      defense: '-10',
    };

    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={true}
          titleKey="skillEffects"
          values={negativeValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const defenseValueCell = screen.getByTestId('skill-defense-value').closest('td');
    expect(defenseValueCell).not.toHaveTextContent('+');
  });

  it('valuesが空の場合、行が表示されない', () => {
    const emptyValues = {} as WeaponSkillEffect;
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={emptyValues}
          notes={emptyValues}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const skillTable = screen.getByTestId('skill-table');
    const tbody = skillTable.getElementsByTagName('tbody')[0];
    if (!tbody) {
      throw new Error('tbodyが見つかりません');
    }
    expect(tbody.getElementsByTagName('tr')).toHaveLength(0);
  });

  it('valuesやnotesがundefinedの場合でもクラッシュせず、行が表示されない', () => {
    const undefinedValues = undefined as unknown as WeaponSkillEffect;
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={undefinedValues}
          notes={undefinedValues}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const skillTable = screen.getByTestId('skill-table');
    expect(skillTable).toBeInTheDocument();
    const tbody = skillTable.getElementsByTagName('tbody')[0];
    if (!tbody) {
      throw new Error('tbodyが見つかりません');
    }
    expect(tbody.getElementsByTagName('tr')).toHaveLength(0);
  });

  it('改行を含む備考が正しく表示される', () => {
    const valuesWithNewlines: WeaponSkillEffect = {
      taRate: '50',
      hp: '3000',
      defense: '10',
    };
    const notesWithNewlines: WeaponSkillEffect = {
      taRate: '行1\n行2',
      hp: '',
      defense: '',
    };

    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={valuesWithNewlines}
          notes={notesWithNewlines}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const skillTable = screen.getByTestId('skill-table');
    const tbody = skillTable.getElementsByTagName('tbody')[0];
    if (!tbody) {
      throw new Error('tbodyが見つかりません');
    }
    const rows: HTMLTableRowElement[] = Array.from(tbody.getElementsByTagName('tr'));
    expect(rows).toHaveLength(3);

    const row1 = rows.at(0);
    if (!row1) {
      throw new Error('row1が見つかりません');
    }
    const noteCell = row1.getElementsByTagName('td')[1];
    expect(noteCell).toHaveTextContent('行1行2');
    expect(noteCell?.getElementsByTagName('br')).toHaveLength(1);
  });

  it('アクセシビリティ属性が正しく設定されている', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={true}
          titleKey="skillEffects"
          values={mockValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    const taRateInput = screen.getByLabelText('TA率');
    expect(taRateInput).toBeDefined();
    expect(taRateInput.getAttribute('aria-label')).toBe('TA率');

    const taRateNote = screen.getByLabelText('TA率 備考');
    expect(taRateNote).toBeDefined();
  });

  it('タイトルに応じて正しいヘッダーが表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={mockValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('スキル効果量')).toBeDefined();

    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="totalAmount"
          values={mockValues}
          notes={mockNotes}
          onChange={mockOnChange}
          onNoteChange={mockOnNoteChange}
          onRemove={mockOnRemove}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('スキル総合値')).toBeDefined();
  });

  describe('スキル項目の追加・削除', () => {
    it('表示モードでは削除ボタンと追加用ドロップダウンが表示されない', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <SkillTable
            id="skill-table"
            isEditing={false}
            titleKey="skillEffects"
            values={mockValues}
            notes={mockNotes}
            onChange={mockOnChange}
            onNoteChange={mockOnNoteChange}
            onRemove={mockOnRemove}
          />
        </I18nextProvider>
      );

      expect(screen.queryByTestId('skill-remove-taRate')).not.toBeInTheDocument();
      expect(screen.queryByTestId('skill-table-add-select')).not.toBeInTheDocument();
    });

    it('編集モードで削除ボタンを押すとonRemoveが呼ばれる', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <SkillTable
            id="skill-table"
            isEditing={true}
            titleKey="skillEffects"
            values={mockValues}
            notes={mockNotes}
            onChange={mockOnChange}
            onNoteChange={mockOnNoteChange}
            onRemove={mockOnRemove}
          />
        </I18nextProvider>
      );

      fireEvent.click(screen.getByTestId('skill-remove-taRate'));
      expect(mockOnRemove).toHaveBeenCalledWith('taRate');
    });

    it('未追加の項目のみが追加用ドロップダウンに表示され、選択するとonChangeが空文字で呼ばれる', () => {
      const partialValues: WeaponSkillEffect = { taRate: '50%' };
      render(
        <I18nextProvider i18n={i18n}>
          <SkillTable
            id="skill-table"
            isEditing={true}
            titleKey="skillEffects"
            values={partialValues}
            notes={{}}
            onChange={mockOnChange}
            onNoteChange={mockOnNoteChange}
            onRemove={mockOnRemove}
          />
        </I18nextProvider>
      );

      const addSelect = screen.getByTestId('skill-table-add-select');
      expect(screen.queryByText('TA率', { selector: 'option' })).not.toBeInTheDocument();

      fireEvent.change(addSelect, { target: { value: 'hp' } });
      expect(mockOnChange).toHaveBeenCalledWith('hp', '');
    });

    it('すべての項目が追加済みの場合、ドロップダウンの代わりにメッセージが表示される', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <SkillTable
            id="skill-table"
            isEditing={true}
            titleKey="skillEffects"
            values={mockValues}
            notes={mockNotes}
            onChange={mockOnChange}
            onNoteChange={mockOnNoteChange}
            onRemove={mockOnRemove}
          />
        </I18nextProvider>
      );

      expect(screen.queryByTestId('skill-table-add-select')).not.toBeInTheDocument();
      expect(screen.getByText('追加できる項目がありません')).toBeInTheDocument();
    });
  });
});
