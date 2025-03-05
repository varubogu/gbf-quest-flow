import { render, screen, fireEvent } from '@testing-library/react';
import { SkillTable } from './SkillTable';
import type { WeaponSkillEffect } from '@/types/types';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { describe, it, beforeEach, expect, vi } from 'vitest';

// i18nの設定をモック化
i18n.use(initReactI18next).init({
  lng: 'ja',
  resources: {
    ja: {
      translation: {
        skill: 'スキル',
        effectAmount: '効果量',
        skillEffects: 'スキル効果量',
        totalAmount: 'スキル総合値',
        taRate: 'TA率',
        hp: '守護',
        defense: '防御力',
      },
    },
  },
});

describe('SkillTable', () => {
  const mockValues: WeaponSkillEffect = {
    taRate: '50%',
    hp: '3000',
    defense: '10%',
  };

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
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
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    // ヘッダーの検証
    expect(screen.getByText('スキル')).toBeDefined();
    expect(screen.getByText('効果量')).toBeDefined();
    expect(screen.getByText('スキル効果量')).toBeDefined();

    // データの検証
    expect(screen.getByText('50%')).toBeDefined();
    expect(screen.getByText('3000')).toBeDefined();
    expect(screen.getByText('10%')).toBeDefined();
  });

  it('編集モードで入力が正しく動作する', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={true}
          titleKey="skillEffects"
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    const taRateInput = screen.getByDisplayValue('50%');
    fireEvent.change(taRateInput, { target: { value: '60%' } });
    expect(mockOnChange).toHaveBeenCalledWith('taRate', '60%');

    const hpInput = screen.getByDisplayValue('3000');
    fireEvent.change(hpInput, { target: { value: '4000' } });
    expect(mockOnChange).toHaveBeenCalledWith('hp', '4000');

    const defenseInput = screen.getByDisplayValue('10%');
    fireEvent.change(defenseInput, { target: { value: '15%' } });
    expect(mockOnChange).toHaveBeenCalledWith('defense', '15%');
  });

  it('valuesがundefinedの場合にデフォルト値が使用される', () => {
    const defaultValues = undefined as unknown as WeaponSkillEffect;
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={defaultValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    const skillTable = screen.getByTestId('skill-table');
    expect(skillTable).toBeInTheDocument();

    const tbodyList = skillTable.getElementsByTagName('tbody');
    expect(tbodyList).toHaveLength(1);

    const tbody = tbodyList[0];
    if (!tbody) {
      throw new Error('tbodyが見つかりません');
    }
    const rows: HTMLTableRowElement[] = Array.from(tbody.getElementsByTagName('tr'));
    if (!rows || rows.length === 0) {
      throw new Error('rowsが見つかりません');
    }
    expect(rows).toHaveLength(3); // ヘッダー行 + 3つのデータ行

    // 1行目 TA率
    const row1 = rows.at(0);
    if (!row1) {
      throw new Error('row1が見つかりません');
    }
    const taRateNameCell = row1.getElementsByTagName('th')[0];
    expect(taRateNameCell).toHaveTextContent('TA率');
    const taRateValueCell = row1.getElementsByTagName('td')[0];
    expect(taRateValueCell).toHaveTextContent(''); // 効果量の検証
    const taRateBr = taRateValueCell?.getElementsByTagName('br');
    expect(taRateBr).toHaveLength(0);

    // 2行目 守護
    const row2 = rows.at(1);
    if (!row2) {
      throw new Error('row2が見つかりません');
    }
    const hpNameCell = row2.getElementsByTagName('th')[0];
    expect(hpNameCell).toHaveTextContent('守護');
    const hpValueCell = row2.getElementsByTagName('td')[0];
    expect(hpValueCell).toHaveTextContent('');
    const hpBr = hpValueCell?.getElementsByTagName('br');
    expect(hpBr).toHaveLength(0);

    // 3行目 防御力
    const row3 = rows.at(2);
    if (!row3) {
      throw new Error('row3が見つかりません');
    }
    const defenseNameCell = row3.getElementsByTagName('th')[0];
    expect(defenseNameCell).toHaveTextContent('防御力');
    const defenseValueCell = row3.getElementsByTagName('td')[0];
    expect(defenseValueCell).toHaveTextContent('');
    const defenseBr = defenseValueCell?.getElementsByTagName('br');
    expect(defenseBr).toHaveLength(0);

  });

  it('改行を含むテキストが正しく表示される', () => {
    const valuesWithNewlines: WeaponSkillEffect = {
      taRate: '50%\n60%',
      hp: '3000\n4000',
      defense: '10%\n15%',
    };

    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={valuesWithNewlines}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    const skillTable = screen.getByTestId('skill-table');
    expect(skillTable).toBeInTheDocument();

    const tbodyList = skillTable.getElementsByTagName('tbody');
    expect(tbodyList).toHaveLength(1);

    const tbody = tbodyList[0];
    if (!tbody) {
      throw new Error('tbodyが見つかりません');
    }
    const rows: HTMLTableRowElement[] = Array.from(tbody.getElementsByTagName('tr'));
    if (!rows || rows.length === 0) {
      throw new Error('rowsが見つかりません');
    }
    expect(rows).toHaveLength(3); // ヘッダー行 + 3つのデータ行

    // 1行目 TA率
    const row1 = rows.at(0);
    if (!row1) {
      throw new Error('row1が見つかりません');
    }
    const taRateNameCell = row1.getElementsByTagName('th')[0];
    expect(taRateNameCell).toHaveTextContent('TA率');
    const taRateValueCell = row1.getElementsByTagName('td')[0];
    expect(taRateValueCell).toHaveTextContent('50%60%'); // 効果量の検証
    const taRateBr = taRateValueCell?.getElementsByTagName('br');
    expect(taRateBr).toHaveLength(1);

    // 2行目 守護
    const row2 = rows.at(1);
    if (!row2) {
      throw new Error('row2が見つかりません');
    }
    const hpNameCell = row2.getElementsByTagName('th')[0];
    expect(hpNameCell).toHaveTextContent('守護');
    const hpValueCell = row2.getElementsByTagName('td')[0];
    expect(hpValueCell).toHaveTextContent('30004000');
    const hpBr = hpValueCell?.getElementsByTagName('br');
    expect(hpBr).toHaveLength(1);

    // 3行目 防御力
    const row3 = rows.at(2);
    if (!row3) {
      throw new Error('row3が見つかりません');
    }
    const defenseNameCell = row3.getElementsByTagName('th')[0];
    expect(defenseNameCell).toHaveTextContent('防御力');
    const defenseValueCell = row3.getElementsByTagName('td')[0];
    expect(defenseValueCell).toHaveTextContent('10%15%');
    const defenseBr = defenseValueCell?.getElementsByTagName('br');
    expect(defenseBr).toHaveLength(1);
  });

  it('アクセシビリティ属性が正しく設定されている', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={true}
          titleKey="skillEffects"
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    const taRateInput = screen.getByLabelText('TA率');
    expect(taRateInput).toBeDefined();
    expect(taRateInput.getAttribute('aria-label')).toBe('TA率');

    const hpInput = screen.getByLabelText('守護');
    expect(hpInput).toBeDefined();
    expect(hpInput.getAttribute('aria-label')).toBe('守護');

    const defenseInput = screen.getByLabelText('防御力');
    expect(defenseInput).toBeDefined();
    expect(defenseInput.getAttribute('aria-label')).toBe('防御力');
  });

  it('タイトルに応じて正しいヘッダーが表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          id="skill-table"
          isEditing={false}
          titleKey="skillEffects"
          values={mockValues}
          onChange={mockOnChange}
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
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('スキル総合値')).toBeDefined();
  });
});
