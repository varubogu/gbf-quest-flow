import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobEquipmentPanel } from './JobEquipmentPanel';
import type { JobEquipment } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        jobMainHand: '特殊装備',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@/core/hooks/ui/base/useAutoResizeTextArea', () => ({
  useAutoResizeTextArea: (): { current: null } => ({ current: null }),
}));

describe('JobEquipmentPanel', () => {
  const mockEquipment: JobEquipment = {
    name: 'テスト装備',
    note: 'テスト装備の説明',
  };

  const onEquipmentChangeMock = vi.fn();

  it('表示モードで装備情報が正しく表示されること', () => {
    render(
      <table>
        <tbody>
          <JobEquipmentPanel
            equipment={mockEquipment}
            isEditing={false}
            onEquipmentChange={onEquipmentChangeMock}
          />
        </tbody>
      </table>
    );

    // 装備ラベルが表示されていることを確認
    expect(screen.getByText('特殊装備')).toBeInTheDocument();

    // 装備名が表示されていることを確認
    expect(screen.getByText('テスト装備')).toBeInTheDocument();

    // 装備説明が表示されていることを確認
    expect(screen.getByText('テスト装備の説明')).toBeInTheDocument();
  });

  it('編集モードで装備名を変更するとonEquipmentChange関数が呼ばれること', () => {
    render(
      <table>
        <tbody>
          <JobEquipmentPanel
            equipment={mockEquipment}
            isEditing={true}
            onEquipmentChange={onEquipmentChangeMock}
          />
        </tbody>
      </table>
    );

    // 装備名の入力フィールドを取得
    const equipmentNameInput = screen.getByDisplayValue('テスト装備');
    expect(equipmentNameInput).toBeInTheDocument();

    // 装備名を変更
    fireEvent.change(equipmentNameInput, { target: { value: '新しい装備' } });

    // onEquipmentChange関数が呼ばれたことを確認
    expect(onEquipmentChangeMock).toHaveBeenCalledWith('name', '新しい装備');
  });

  it('編集モードで装備説明を変更するとonEquipmentChange関数が呼ばれること', () => {
    render(
      <table>
        <tbody>
          <JobEquipmentPanel
            equipment={mockEquipment}
            isEditing={true}
            onEquipmentChange={onEquipmentChangeMock}
          />
        </tbody>
      </table>
    );

    // 装備説明の入力フィールドを取得
    const equipmentNoteTextarea = screen.getByDisplayValue('テスト装備の説明');
    expect(equipmentNoteTextarea).toBeInTheDocument();

    // 装備説明を変更
    fireEvent.change(equipmentNoteTextarea, { target: { value: '新しい装備の説明' } });

    // onEquipmentChange関数が呼ばれたことを確認
    expect(onEquipmentChangeMock).toHaveBeenCalledWith('note', '新しい装備の説明');
  });

  it('改行を含む装備説明が正しく表示されること', () => {
    const equipmentWithMultilineNote: JobEquipment = {
      ...mockEquipment,
      note: 'テスト装備の説明\n複数行あり',
    };

    render(
      <table>
        <tbody>
          <JobEquipmentPanel
            equipment={equipmentWithMultilineNote}
            isEditing={false}
            onEquipmentChange={onEquipmentChangeMock}
          />
        </tbody>
      </table>
    );

    // 改行が<br>タグに変換されていることを確認（テキストコンテンツとしては連結されて表示される）
    expect(screen.getByText('テスト装備の説明複数行あり')).toBeInTheDocument();
  });
});