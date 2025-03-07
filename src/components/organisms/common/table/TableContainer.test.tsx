import { render, screen } from '@testing-library/react';
import { TableContainer } from '@/components/organisms/common/table/TableContainer';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import type { Action, TableAlignment } from '@/types/types';
import * as useTableEventHandlers from '@/core/hooks/ui/table/useTableEventHandlers';
import * as useFlowStore from '@/core/stores/flowStore';
import * as useCursorStore from '@/core/stores/cursorStore';
import * as useSettingsStore from '@/core/stores/settingsStore';

// モックデータ
const mockData: Action[] = [
  { hp: '100%', prediction: '特殊技', charge: '', guard: '', action: 'アクション1', note: '' },
  { hp: '90%', prediction: '通常攻撃', charge: '', guard: '', action: 'アクション2', note: '' },
  { hp: '80%', prediction: '特殊技', charge: '', guard: '', action: 'アクション3', note: '' },
];

// 列定義
const columns: (keyof Action)[] = ['hp', 'prediction', 'charge', 'guard', 'action', 'note'];

// 列の配置
const alignments: Record<keyof Action, TableAlignment> = {
  hp: 'right',
  prediction: 'left',
  charge: 'center',
  guard: 'center',
  action: 'left',
  note: 'left',
};

// 行のクラス名を生成する関数
const getRowClasses = ({ index, currentRow, baseBackground }: { index: number; currentRow: number; baseBackground: string }): string => {
  return `grid grid-cols-[5fr_15fr_4fr_4fr_30fr_20fr] border-b border-gray-400 border-l border-r ${
    index === currentRow ? 'border border-yellow-500 bg-yellow-200' : baseBackground
  }`;
};

// ヘッダーのクラス名
const headerClasses = 'grid grid-cols-[5fr_15fr_4fr_4fr_30fr_20fr] bg-green-300 sticky top-12 z-10 shadow-sm border-b border-gray-400 border-l border-r';

// モック関数
const mockHandleRowSelect = vi.fn();
const mockHandleMoveUp = vi.fn();
const mockHandleMoveDown = vi.fn();
const mockHandleCellEdit = vi.fn();
const mockHandleDeleteRow = vi.fn();
const mockHandleAddRow = vi.fn();
const mockHandlePasteRows = vi.fn();

// モックの設定
vi.mock('@/components/organisms/common/table/Table', () => ({
  Table: vi.fn(
    ({
      data,
      currentRow,
      buttonPosition,
      onRowSelect,
      onMoveUp,
      onMoveDown,
      isEditMode,
      onCellEdit,
      onDeleteRow,
      onAddRow,
      onPasteRows,
      columns,
      alignments,
      getRowClasses,
      headerClasses,
      tableId
    }: {
      data: Action[];
      currentRow: number;
      buttonPosition?: 'left' | 'right';
      onRowSelect: (_index: number) => void;
      onMoveUp: () => void;
      onMoveDown: () => void;
      isEditMode?: boolean;
      onCellEdit?: (_rowIndex: number, _field: keyof Action, _value: string) => void;
      onDeleteRow?: (_index: number) => void;
      onAddRow?: (_index: number) => void;
      onPasteRows?: (_index: number, _rows: Partial<Action>[]) => void;
      columns: (keyof Action)[];
      alignments: Record<keyof Action, TableAlignment>;
      getRowClasses: (_props: { index: number; currentRow: number; baseBackground: string }) => string;
      headerClasses: string;
      tableId?: string;
    }) => (
    <div data-testid="mock-table">
      <div
        data-testid="table-props"
        data-data={JSON.stringify(data)}
        data-current-row={currentRow}
        data-button-position={buttonPosition}
        data-is-edit-mode={isEditMode}
        data-columns={JSON.stringify(columns)}
        data-alignments={JSON.stringify(alignments)}
        data-header-classes={headerClasses}
        data-table-id={tableId}
      />
      <button data-testid="row-select-button" onClick={() => onRowSelect(1)}>Select Row</button>
      <button data-testid="move-up-button" onClick={onMoveUp}>Move Up</button>
      <button data-testid="move-down-button" onClick={onMoveDown}>Move Down</button>
      {onCellEdit && <button data-testid="cell-edit-button" onClick={() => onCellEdit(0, 'action', 'edited')}>Edit Cell</button>}
      {onDeleteRow && <button data-testid="delete-row-button" onClick={() => onDeleteRow(0)}>Delete Row</button>}
      {onAddRow && <button data-testid="add-row-button" onClick={() => onAddRow(0)}>Add Row</button>}
      {onPasteRows && <button data-testid="paste-rows-button" onClick={() => onPasteRows(0, [{ action: 'pasted' }])}>Paste Rows</button>}
    </div>
  )),
}));

describe('TableContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // useTableEventHandlersのモック
    vi.spyOn(useTableEventHandlers, 'useTableEventHandlers').mockReturnValue({
      handleRowSelect: mockHandleRowSelect,
      handleMoveUp: mockHandleMoveUp,
      handleMoveDown: mockHandleMoveDown,
      handleCellEdit: mockHandleCellEdit,
      handleDeleteRow: mockHandleDeleteRow,
      handleAddRow: mockHandleAddRow,
      handlePasteRows: mockHandlePasteRows,
    });

    // useFlowStoreのモック
    vi.spyOn(useFlowStore, 'default').mockImplementation((selector) =>
      selector({
        flowData: {
          flow: mockData,
          title: 'テストフロー',
          quest: 'テストクエスト',
          author: 'テスト作者',
          description: 'テスト説明',
          updateDate: '2023-01-01',
          note: 'テストノート',
          organization: {
            job: {
              name: 'テストジョブ',
              note: '',
              equipment: { name: '', note: '' },
              abilities: []
            },
            member: { front: [], back: [] },
            weapon: { main: { name: '', note: '', additionalSkill: '' }, other: [], additional: [] },
            weaponEffects: { taRate: '', hp: '', defense: '' },
            totalEffects: { taRate: '', hp: '', defense: '' },
            summon: { main: { name: '', note: '' }, friend: { name: '', note: '' }, other: [], sub: [] }
          },
          always: ''
        },
        setFlowData: vi.fn(),
        originalData: null,
        getFlowData: () => null,
        getActionById: () => undefined
      })
    );

    // useCursorStoreのモック
    vi.spyOn(useCursorStore, 'default').mockImplementation((selector) =>
      selector({ currentRow: 1, setCurrentRow: vi.fn() })
    );

    // useSettingsStoreのモック（参照系）
    vi.spyOn(useSettingsStore, 'default').mockImplementation((selector) =>
      selector({
        settings: {
          buttonAlignment: 'left',
          actionTableClickType: 'single',
          language: '日本語',
          tablePadding: 8
        },
        updateSettings: vi.fn()
      })
    );
  });

  it('正しくレンダリングされる', () => {
    render(
      <TableContainer<Action>
        data={mockData}
        currentRow={1}
        columns={columns}
        alignments={alignments}
        getRowClasses={getRowClasses}
        headerClasses={headerClasses}
        onRowSelect={mockHandleRowSelect}
        onMoveUp={mockHandleMoveUp}
        onMoveDown={mockHandleMoveDown}
        onCellEdit={mockHandleCellEdit}
        onDeleteRow={mockHandleDeleteRow}
        onAddRow={mockHandleAddRow}
        onPasteRows={mockHandlePasteRows}
      />
    );
    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
  });

  it('propsが正しく渡される', () => {
    render(
      <TableContainer<Action>
        data={mockData}
        currentRow={1}
        columns={columns}
        alignments={alignments}
        getRowClasses={getRowClasses}
        headerClasses={headerClasses}
        onRowSelect={mockHandleRowSelect}
        onMoveUp={mockHandleMoveUp}
        onMoveDown={mockHandleMoveDown}
        onCellEdit={mockHandleCellEdit}
        onDeleteRow={mockHandleDeleteRow}
        onAddRow={mockHandleAddRow}
        onPasteRows={mockHandlePasteRows}
      />
    );
    const tableProps = screen.getByTestId('table-props');

    // データが正しく渡されていることを確認
    expect(JSON.parse(tableProps.getAttribute('data-data') || '[]')).toEqual(mockData);

    // 現在の行が正しく渡されていることを確認
    expect(tableProps.getAttribute('data-current-row')).toBe('1');

    // ボタン位置が正しく渡されていることを確認
    expect(tableProps.getAttribute('data-button-position')).toBe('left');

    // 編集モードが正しく渡されていることを確認
    expect(tableProps.getAttribute('data-is-edit-mode')).toBe('false');
  });

  it('isEditModeプロパティが正しく渡される', () => {
    render(
      <TableContainer<Action>
        data={mockData}
        currentRow={1}
        columns={columns}
        alignments={alignments}
        getRowClasses={getRowClasses}
        headerClasses={headerClasses}
        onRowSelect={mockHandleRowSelect}
        onMoveUp={mockHandleMoveUp}
        onMoveDown={mockHandleMoveDown}
        onCellEdit={mockHandleCellEdit}
        onDeleteRow={mockHandleDeleteRow}
        onAddRow={mockHandleAddRow}
        onPasteRows={mockHandlePasteRows}
        isEditMode={true}
      />
    );
    const tableProps = screen.getByTestId('table-props');
    expect(tableProps.getAttribute('data-is-edit-mode')).toBe('true');
  });

  it('dataプロパティが正しく渡される', () => {
    const customData: Action[] = [
      { hp: 'カスタム', prediction: 'カスタム', charge: '', guard: '', action: 'カスタム', note: '' }
    ];
    render(
      <TableContainer<Action>
        data={customData}
        currentRow={1}
        columns={columns}
        alignments={alignments}
        getRowClasses={getRowClasses}
        headerClasses={headerClasses}
        onRowSelect={mockHandleRowSelect}
        onMoveUp={mockHandleMoveUp}
        onMoveDown={mockHandleMoveDown}
        onCellEdit={mockHandleCellEdit}
        onDeleteRow={mockHandleDeleteRow}
        onAddRow={mockHandleAddRow}
        onPasteRows={mockHandlePasteRows}
      />
    );
    const tableProps = screen.getByTestId('table-props');
    expect(JSON.parse(tableProps.getAttribute('data-data') || '[]')).toEqual(customData);
  });

  it('イベントハンドラが正しく呼び出される', () => {
    render(
      <TableContainer<Action>
        data={mockData}
        currentRow={1}
        columns={columns}
        alignments={alignments}
        getRowClasses={getRowClasses}
        headerClasses={headerClasses}
        onRowSelect={mockHandleRowSelect}
        onMoveUp={mockHandleMoveUp}
        onMoveDown={mockHandleMoveDown}
        onCellEdit={mockHandleCellEdit}
        onDeleteRow={mockHandleDeleteRow}
        onAddRow={mockHandleAddRow}
        onPasteRows={mockHandlePasteRows}
      />
    );

    // 行選択
    screen.getByTestId('row-select-button').click();
    expect(mockHandleRowSelect).toHaveBeenCalledWith(1);

    // 上に移動
    screen.getByTestId('move-up-button').click();
    expect(mockHandleMoveUp).toHaveBeenCalled();

    // 下に移動
    screen.getByTestId('move-down-button').click();
    expect(mockHandleMoveDown).toHaveBeenCalled();

    // セル編集
    screen.getByTestId('cell-edit-button').click();
    expect(mockHandleCellEdit).toHaveBeenCalledWith(0, 'action', 'edited');

    // 行削除
    screen.getByTestId('delete-row-button').click();
    expect(mockHandleDeleteRow).toHaveBeenCalledWith(0);

    // 行追加
    screen.getByTestId('add-row-button').click();
    expect(mockHandleAddRow).toHaveBeenCalledWith(0);

    // 行貼り付け
    screen.getByTestId('paste-rows-button').click();
    expect(mockHandlePasteRows).toHaveBeenCalledWith(0, [{ action: 'pasted' }]);
  });

  it('空のデータ配列の場合はテーブルを表示する', () => {
    const { container } = render(
      <TableContainer<Action>
        data={[]}
        currentRow={0}
        columns={columns}
        alignments={alignments}
        getRowClasses={getRowClasses}
        headerClasses={headerClasses}
        onRowSelect={mockHandleRowSelect}
        onMoveUp={mockHandleMoveUp}
        onMoveDown={mockHandleMoveDown}
      />
    );
    expect(container.firstChild).not.toBeNull();
  });
});