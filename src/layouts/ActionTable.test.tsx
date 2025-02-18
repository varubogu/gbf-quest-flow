import { render, fireEvent, screen } from '@testing-library/react';
import { ActionTable } from '../components/organisms/ActionTable';
import type { Action } from '@/types/models';
import { describe, it, expect, vi } from 'vitest';

// モックデータ
const mockData: Action[] = [
  { hp: '100%', prediction: '特殊技', charge: '', guard: '', action: 'アクション1', note: '' },
  { hp: '90%', prediction: '通常攻撃', charge: '', guard: '', action: 'アクション2', note: '' },
  { hp: '80%', prediction: '特殊技', charge: '', guard: '', action: 'アクション3', note: '' },
];

describe('ActionTable', () => {
  const mockOnRowSelect = vi.fn();
  const mockOnMoveUp = vi.fn();
  const mockOnMoveDown = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('マウスホイールで上下に移動できる', () => {
    render(
      <ActionTable
        data={mockData}
        currentRow={1}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const table = screen.getByRole('table');

    // 上にスクロール
    fireEvent.wheel(table, { deltaY: -100, deltaMode: 1 });
    expect(mockOnRowSelect).toHaveBeenCalledWith(0);

    // 下にスクロール
    fireEvent.wheel(table, { deltaY: 100, deltaMode: 1 });
    expect(mockOnRowSelect).toHaveBeenCalledWith(2);
  });

  it('タッチパッドのスクロールは累積値に基づいて移動する', () => {
    render(
      <ActionTable
        data={mockData}
        currentRow={1}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const table = screen.getByRole('table');

    // 閾値未満のスクロール
    fireEvent.wheel(table, { deltaY: 10, deltaMode: 0 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();

    // 閾値を超えるスクロール（複数回の累積）
    fireEvent.wheel(table, { deltaY: 20, deltaMode: 0 });
    fireEvent.wheel(table, { deltaY: 20, deltaMode: 0 });
    expect(mockOnRowSelect).toHaveBeenCalledWith(2);
  });

  it('最初の行より上、最後の行より下にはスクロールできない', () => {
    render(
      <ActionTable
        data={mockData}
        currentRow={0}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const table = screen.getByRole('table');

    // 最初の行より上にスクロールしようとする
    fireEvent.wheel(table, { deltaY: -100, deltaMode: 1 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();

    // 最後の行まで移動
    render(
      <ActionTable
        data={mockData}
        currentRow={2}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    // 最後の行より下にスクロールしようとする
    fireEvent.wheel(table, { deltaY: 100, deltaMode: 1 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });

  it('編集モード中はスクロールが無効になる', () => {
    render(
      <ActionTable
        data={mockData}
        currentRow={1}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
        isEditMode={true}
      />
    );

    const table = screen.getByRole('table');

    // マウスホイールでのスクロール
    fireEvent.wheel(table, { deltaY: -100, deltaMode: 1 });
    fireEvent.wheel(table, { deltaY: 100, deltaMode: 1 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();

    // タッチパッドでのスクロール
    fireEvent.wheel(table, { deltaY: 20, deltaMode: 0 });
    fireEvent.wheel(table, { deltaY: 20, deltaMode: 0 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });
}); 