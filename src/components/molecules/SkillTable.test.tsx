import { render, screen, fireEvent } from '@testing-library/react';
import { SkillTable } from './SkillTable';
import type { WeaponSkillEffect } from '@/types/models';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('SkillTable', () => {
  const mockValues: WeaponSkillEffect = {
    taRate: '50%',
    hp: '3000',
    defense: '10%',
  };

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    // テスト前に言語を日本語に設定
    i18n.changeLanguage('ja');
  });

  it('表示モードで正しくデータが表示される', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          isEditing={false}
          title={i18n.t('skillEffects', { ns: 'weapon' })}
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    // 翻訳の読み込みを待機
    await screen.findByRole('table');

    // ヘッダーの検証
    expect(screen.getByText(i18n.t('skill', { ns: 'weapon' }))).toBeDefined();
    expect(screen.getByText(i18n.t('effectAmount', { ns: 'weapon' }))).toBeDefined();

    // データの検証
    expect(screen.getByText('50%')).toBeDefined();
    expect(screen.getByText('3000')).toBeDefined();
    expect(screen.getByText('10%')).toBeDefined();
  });

  it('編集モードで入力が正しく動作する', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          isEditing={true}
          title="スキル効果量"
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
          isEditing={false}
          title="スキル効果量"
          values={defaultValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    // デフォルト値の各フィールドを個別に検証
    const cells = screen.getAllByRole('cell');
    const taRateCell = cells[0];
    const hpCell = cells[1];
    const defenseCell = cells[2];

    expect(taRateCell).toHaveTextContent('');
    expect(hpCell).toHaveTextContent('');
    expect(defenseCell).toHaveTextContent('');

    // テーブルの構造が正しいことを確認
    expect(screen.getByRole('table')).toBeDefined();
    expect(screen.getAllByRole('row')).toHaveLength(4); // ヘッダー行 + 3つのデータ行
    expect(screen.getAllByRole('columnheader')).toHaveLength(2); // スキル + 効果量
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
          isEditing={false}
          title="スキル効果量"
          values={valuesWithNewlines}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    // セルごとに改行を含むテキストを検証
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(3); // 3つのセルが存在することを確認

    // TA率のセル
    const taRateCell = cells[0];
    const taRateLines = taRateCell?.getElementsByTagName('br');
    expect(taRateLines).toHaveLength(1); // 改行が1つ存在
    expect(taRateCell?.textContent).toBe('50%60%');

    // HPのセル
    const hpCell = cells[1];
    const hpLines = hpCell?.getElementsByTagName('br');
    expect(hpLines).toHaveLength(1);
    expect(hpCell?.textContent).toBe('30004000');

    // 防御力のセル
    const defenseCell = cells[2];
    const defenseLines = defenseCell?.getElementsByTagName('br');
    expect(defenseLines).toHaveLength(1);
    expect(defenseCell?.textContent).toBe('10%15%');

    // 各セルに<br>要素が正しく配置されていることを確認
    cells.forEach((cell) => {
      const fragments = cell.childNodes;
      expect(fragments).toHaveLength(3); // テキスト、br、テキストの3要素
      const brElement = fragments[1] as ChildNode;
      expect(brElement.nodeName).toBe('BR');
    });
  });

  it('アクセシビリティ属性が正しく設定されている', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          isEditing={true}
          title="スキル効果量"
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    // 翻訳の読み込みを待機
    await screen.findByLabelText(i18n.t('taRate', { ns: 'weapon' }));

    const taRateInput = screen.getByLabelText(i18n.t('taRate', { ns: 'weapon' }));
    expect(taRateInput).toBeDefined();
    expect(taRateInput.getAttribute('aria-label')).toBe(i18n.t('taRate', { ns: 'weapon' }));

    const hpInput = screen.getByLabelText('HP');
    expect(hpInput).toBeDefined();
    expect(hpInput.getAttribute('aria-label')).toBe('HP');

    const defenseInput = screen.getByLabelText(i18n.t('defense', { ns: 'weapon' }));
    expect(defenseInput).toBeDefined();
    expect(defenseInput.getAttribute('aria-label')).toBe(i18n.t('defense', { ns: 'weapon' }));
  });

  it('タイトルに応じて正しいヘッダーが表示される', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          isEditing={false}
          title={i18n.t('skillEffects', { ns: 'weapon' })}
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    await screen.findByRole('table');
    expect(screen.getByText(i18n.t('effectAmount', { ns: 'weapon' }))).toBeDefined();

    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          isEditing={false}
          title={i18n.t('totalAmount', { ns: 'weapon' })}
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    await screen.findByRole('table');
    expect(screen.getByText(i18n.t('totalAmount', { ns: 'weapon' }))).toBeDefined();
  });
});
