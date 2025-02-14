import { render, screen, fireEvent } from '@testing-library/react';
import { SkillTable } from './SkillTable';
import { type WeaponSkillEffect } from '@/types/models';
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

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('3000')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
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
  });
});