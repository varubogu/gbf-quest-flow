import { render, fireEvent, act } from '@testing-library/react';
import { Table } from './Table';
import type { Action } from '@/types/models';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

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
    // scrollToのモック化
    Element.prototype.scrollTo = vi.fn();
  });

  it('マウスホイールで上下に移動できる', () => {
    const { container } = render(
      <Table
        data={mockData}
        currentRow={1}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const tableContainer = container.querySelector('.flex.flex-col.h-full.overflow-y-auto');
    if (!tableContainer) throw new Error('Table container not found');

    // 上にスクロール
    fireEvent.wheel(tableContainer, { deltaY: -100, deltaMode: 1 });
    expect(mockOnRowSelect).toHaveBeenCalledWith(0);

    // 下にスクロール
    fireEvent.wheel(tableContainer, { deltaY: 100, deltaMode: 1 });
    expect(mockOnRowSelect).toHaveBeenCalledWith(2);
  });

  it('タッチパッドのスクロールは累積値に基づいて移動する', async () => {
    const { container } = render(
      <Table
        data={mockData}
        currentRow={1}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const tableContainer = container.querySelector('.flex.flex-col.h-full.overflow-y-auto');
    if (!tableContainer) throw new Error('Table container not found');

    // 閾値未満のスクロール
    await act(async () => {
      fireEvent.wheel(tableContainer, { deltaY: 10, deltaMode: 0 });
    });
    expect(mockOnRowSelect).not.toHaveBeenCalled();

    // 閾値を超えるスクロール（複数回の累積）
    fireEvent.wheel(tableContainer, { deltaY: 20, deltaMode: 0 });
    fireEvent.wheel(tableContainer, { deltaY: 20, deltaMode: 0 });
    expect(mockOnRowSelect).toHaveBeenCalledWith(2);
  });

  it('最初の行より上、最後の行より下にはスクロールできない', () => {
    // 最初の行でのテスト
    const { container: firstContainer } = render(
      <Table
        data={mockData}
        currentRow={0}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const firstTableContainer = firstContainer.querySelector(
      '.flex.flex-col.h-full.overflow-y-auto'
    );
    if (!firstTableContainer) throw new Error('Table container not found');

    // 最初の行より上にスクロールしようとする
    fireEvent.wheel(firstTableContainer, { deltaY: -100, deltaMode: 1 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();

    // 最後の行でのテスト
    const { container: lastContainer } = render(
      <Table
        data={mockData}
        currentRow={2}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    );

    const lastTableContainer = lastContainer.querySelector('.flex.flex-col.h-full.overflow-y-auto');
    if (!lastTableContainer) throw new Error('Table container not found');

    // 最後の行より下にスクロールしようとする
    fireEvent.wheel(lastTableContainer, { deltaY: 100, deltaMode: 1 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });

  it('編集モード中はスクロールが無効になる', () => {
    const { container } = render(
      <Table
        data={mockData}
        currentRow={1}
        buttonPosition="right"
        onRowSelect={mockOnRowSelect}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
        isEditMode={true}
      />
    );

    const tableContainer = container.querySelector('.flex.flex-col.h-full.overflow-y-auto');
    if (!tableContainer) throw new Error('Table container not found');

    // マウスホイールでのスクロール
    fireEvent.wheel(tableContainer, { deltaY: -100, deltaMode: 1 });
    fireEvent.wheel(tableContainer, { deltaY: 100, deltaMode: 1 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();

    // タッチパッドでのスクロール
    fireEvent.wheel(tableContainer, { deltaY: 20, deltaMode: 0 });
    fireEvent.wheel(tableContainer, { deltaY: 20, deltaMode: 0 });
    expect(mockOnRowSelect).not.toHaveBeenCalled();
  });
});
