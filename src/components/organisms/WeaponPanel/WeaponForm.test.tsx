import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeaponForm } from './WeaponForm';
import { vi } from 'vitest';

// モックデータ
const mockWeapons = {
  main: {
    name: 'テスト武器',
    additionalSkill: 'テストスキル',
    note: 'テストノート',
  },
  other: [
    {
      name: 'その他武器1',
      additionalSkill: 'その他スキル1',
      note: 'その他ノート1',
    },
  ],
  additional: [
    {
      name: '追加武器1',
      additionalSkill: '追加スキル1',
      note: '追加ノート1',
    },
  ],
};

// モック関数
const mockOnWeaponChange = vi.fn();

// i18nextのモック
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('WeaponForm', () => {
  it('表示モードで正しくレンダリングされること', () => {
    render(
      <WeaponForm isEditing={false} weapons={mockWeapons} onWeaponChange={mockOnWeaponChange} />
    );

    // メイン武器のテスト
    expect(screen.getByText('weaponMain')).toBeInTheDocument();
    expect(screen.getByText('テスト武器')).toBeInTheDocument();
    expect(screen.getByText('テストスキル')).toBeInTheDocument();
    expect(screen.getByText('テストノート')).toBeInTheDocument();

    // その他武器のテスト
    expect(screen.getByText('weaponNormal')).toBeInTheDocument();
    expect(screen.getByText('その他武器1')).toBeInTheDocument();
    expect(screen.getByText('その他スキル1')).toBeInTheDocument();
    expect(screen.getByText('その他ノート1')).toBeInTheDocument();

    // 追加武器のテスト
    expect(screen.getByText('weaponAdditional')).toBeInTheDocument();
    expect(screen.getByText('追加武器1')).toBeInTheDocument();
    expect(screen.getByText('追加スキル1')).toBeInTheDocument();
    expect(screen.getByText('追加ノート1')).toBeInTheDocument();
  });

  it('編集モードで正しくレンダリングされ、入力が反映されること', () => {
    render(<WeaponForm isEditing={true} weapons={mockWeapons} onWeaponChange={mockOnWeaponChange} />);

    // メイン武器の入力テスト
    const mainNameInput = screen.getByDisplayValue('テスト武器');
    fireEvent.change(mainNameInput, { target: { value: '新しい武器名' } });
    expect(mockOnWeaponChange).toHaveBeenCalledWith('main', null, 'name', '新しい武器名');

    const mainSkillTextarea = screen.getByDisplayValue('テストスキル');
    fireEvent.change(mainSkillTextarea, { target: { value: '新しいスキル' } });
    expect(mockOnWeaponChange).toHaveBeenCalledWith('main', null, 'additionalSkill', '新しいスキル');

    const mainNoteTextarea = screen.getByDisplayValue('テストノート');
    fireEvent.change(mainNoteTextarea, { target: { value: '新しいノート' } });
    expect(mockOnWeaponChange).toHaveBeenCalledWith('main', null, 'note', '新しいノート');

    // その他武器の入力テスト
    const otherNameInput = screen.getByDisplayValue('その他武器1');
    fireEvent.change(otherNameInput, { target: { value: '新しいその他武器' } });
    expect(mockOnWeaponChange).toHaveBeenCalledWith('other', 0, 'name', '新しいその他武器');

    // 追加武器の入力テスト
    const additionalNameInput = screen.getByDisplayValue('追加武器1');
    fireEvent.change(additionalNameInput, { target: { value: '新しい追加武器' } });
    expect(mockOnWeaponChange).toHaveBeenCalledWith('additional', 0, 'name', '新しい追加武器');
  });
});