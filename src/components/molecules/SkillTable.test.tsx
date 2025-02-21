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
  });

  it('表示モードで正しくデータが表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          isEditing={false}
          title="スキル効果量"
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

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

    expect(screen.getByText('')).toBeDefined(); // デフォルト値の空文字が表示される
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

    expect(screen.getByText('50%')).toBeDefined();
    expect(screen.getByText('60%')).toBeDefined();
    expect(screen.getByText('3000')).toBeDefined();
    expect(screen.getByText('4000')).toBeDefined();
    expect(screen.getByText('10%')).toBeDefined();
    expect(screen.getByText('15%')).toBeDefined();
  });

  it('アクセシビリティ属性が正しく設定されている', () => {
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

    const taRateInput = screen.getByLabelText('TA率');
    expect(taRateInput).toBeDefined();
    expect(taRateInput.getAttribute('aria-label')).toBe('TA率');

    const hpInput = screen.getByLabelText('HP');
    expect(hpInput).toBeDefined();
    expect(hpInput.getAttribute('aria-label')).toBe('HP');

    const defenseInput = screen.getByLabelText('防御力');
    expect(defenseInput).toBeDefined();
    expect(defenseInput.getAttribute('aria-label')).toBe('防御力');
  });

  it('タイトルに応じて正しいヘッダーが表示される', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          isEditing={false}
          title="スキル効果量"
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('効果量')).toBeDefined();

    render(
      <I18nextProvider i18n={i18n}>
        <SkillTable
          isEditing={false}
          title="スキル総合値"
          values={mockValues}
          onChange={mockOnChange}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('スキル総量')).toBeDefined();
  });
});
