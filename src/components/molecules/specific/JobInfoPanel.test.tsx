import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobInfoPanel } from './JobInfoPanel';
import type { Job } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string) => string } => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        jobClass: 'ジョブ',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@/core/hooks/ui/base/useAutoResizeTextArea', () => ({
  useAutoResizeTextArea: (): { current: null } => ({ current: null }),
}));

describe('JobInfoPanel', () => {
  const mockJob: Job = {
    name: 'テストジョブ',
    note: 'テストジョブの説明',
    equipment: { name: '', note: '' },
    abilities: [],
  };

  const onJobChangeMock = vi.fn();

  it('表示モードでジョブ情報が正しく表示されること', () => {
    render(
      <table>
        <tbody>
          <JobInfoPanel
            job={mockJob}
            isEditing={false}
            onJobChange={onJobChangeMock}
          />
        </tbody>
      </table>
    );

    // ジョブラベルが表示されていることを確認
    expect(screen.getByText('ジョブ')).toBeInTheDocument();

    // ジョブ名が表示されていることを確認
    expect(screen.getByText('テストジョブ')).toBeInTheDocument();

    // ジョブ説明が表示されていることを確認
    expect(screen.getByText('テストジョブの説明')).toBeInTheDocument();
  });

  it('編集モードでジョブ名を変更するとonJobChange関数が呼ばれること', () => {
    render(
      <table>
        <tbody>
          <JobInfoPanel
            job={mockJob}
            isEditing={true}
            onJobChange={onJobChangeMock}
          />
        </tbody>
      </table>
    );

    // ジョブ名の入力フィールドを取得
    const jobNameInput = screen.getByDisplayValue('テストジョブ');
    expect(jobNameInput).toBeInTheDocument();

    // ジョブ名を変更
    fireEvent.change(jobNameInput, { target: { value: '新しいジョブ' } });

    // onJobChange関数が呼ばれたことを確認
    expect(onJobChangeMock).toHaveBeenCalledWith('name', '新しいジョブ');
  });

  it('編集モードでジョブ説明を変更するとonJobChange関数が呼ばれること', () => {
    render(
      <table>
        <tbody>
          <JobInfoPanel
            job={mockJob}
            isEditing={true}
            onJobChange={onJobChangeMock}
          />
        </tbody>
      </table>
    );

    // ジョブ説明の入力フィールドを取得
    const jobNoteTextarea = screen.getByDisplayValue('テストジョブの説明');
    expect(jobNoteTextarea).toBeInTheDocument();

    // ジョブ説明を変更
    fireEvent.change(jobNoteTextarea, { target: { value: '新しいジョブの説明' } });

    // onJobChange関数が呼ばれたことを確認
    expect(onJobChangeMock).toHaveBeenCalledWith('note', '新しいジョブの説明');
  });

  it('改行を含むジョブ説明が正しく表示されること', () => {
    const jobWithMultilineNote: Job = {
      ...mockJob,
      note: 'テストジョブの説明\n複数行あり',
    };

    render(
      <table>
        <tbody>
          <JobInfoPanel
            job={jobWithMultilineNote}
            isEditing={false}
            onJobChange={onJobChangeMock}
          />
        </tbody>
      </table>
    );

    // 改行が<br>タグに変換されていることを確認（テキストコンテンツとしては連結されて表示される）
    expect(screen.getByText('テストジョブの説明複数行あり')).toBeInTheDocument();
  });
});