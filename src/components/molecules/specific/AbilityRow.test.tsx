import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AbilityRow } from './AbilityRow';
import type { JobAbility } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        characterAbilities: 'アビリティ',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@/core/hooks/ui/base/useAutoResizeTextArea', () => ({
  useAutoResizeTextArea: (): { current: null } => ({ current: null }),
}));

describe('AbilityRow', () => {
  const mockAbility: JobAbility = {
    name: 'テストアビリティ',
    note: 'テストアビリティの説明',
  };

  const onAbilityChangeMock = vi.fn();

  it('表示モードでアビリティ情報が正しく表示されること', () => {
    render(
      <table>
        <tbody>
          <AbilityRow
            ability={mockAbility}
            index={0}
            isEditing={false}
            totalAbilities={1}
            onAbilityChange={onAbilityChangeMock}
          />
        </tbody>
      </table>
    );

    // アビリティラベルが表示されていることを確認
    expect(screen.getByText('アビリティ')).toBeInTheDocument();

    // アビリティ名が表示されていることを確認
    expect(screen.getByText('テストアビリティ')).toBeInTheDocument();

    // アビリティ説明が表示されていることを確認
    expect(screen.getByText('テストアビリティの説明')).toBeInTheDocument();
  });

  it('編集モードでアビリティ名を変更するとonAbilityChange関数が呼ばれること', () => {
    render(
      <table>
        <tbody>
          <AbilityRow
            ability={mockAbility}
            index={0}
            isEditing={true}
            totalAbilities={1}
            onAbilityChange={onAbilityChangeMock}
          />
        </tbody>
      </table>
    );

    // アビリティ名の入力フィールドを取得
    const abilityNameInput = screen.getByDisplayValue('テストアビリティ');
    expect(abilityNameInput).toBeInTheDocument();

    // アビリティ名を変更
    fireEvent.change(abilityNameInput, { target: { value: '新しいアビリティ' } });

    // onAbilityChange関数が呼ばれたことを確認
    expect(onAbilityChangeMock).toHaveBeenCalledWith(0, 'name', '新しいアビリティ');
  });

  it('編集モードでアビリティ説明を変更するとonAbilityChange関数が呼ばれること', () => {
    render(
      <table>
        <tbody>
          <AbilityRow
            ability={mockAbility}
            index={0}
            isEditing={true}
            totalAbilities={1}
            onAbilityChange={onAbilityChangeMock}
          />
        </tbody>
      </table>
    );

    // アビリティ説明の入力フィールドを取得
    const abilityNoteTextarea = screen.getByDisplayValue('テストアビリティの説明');
    expect(abilityNoteTextarea).toBeInTheDocument();

    // アビリティ説明を変更
    fireEvent.change(abilityNoteTextarea, { target: { value: '新しいアビリティの説明' } });

    // onAbilityChange関数が呼ばれたことを確認
    expect(onAbilityChangeMock).toHaveBeenCalledWith(0, 'note', '新しいアビリティの説明');
  });

  it('インデックスが0以外の場合、アビリティラベルが表示されないこと', () => {
    render(
      <table>
        <tbody>
          <AbilityRow
            ability={mockAbility}
            index={1}
            isEditing={false}
            totalAbilities={2}
            onAbilityChange={onAbilityChangeMock}
          />
        </tbody>
      </table>
    );

    // アビリティラベルが表示されていないことを確認
    expect(screen.queryByText('アビリティ')).not.toBeInTheDocument();
  });
});