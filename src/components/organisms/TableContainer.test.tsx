import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Action } from '@/types/types';
import type { Flow } from '@/types/models';
import type { JSX } from 'react';

// モックの設定
// モックは全てvi.mockの呼び出しをファイルの先頭に配置する必要がある

// 実際のインポートの前にモックを定義
vi.mock('@/core/facades/flowFacade', () => ({
  setFlowData: vi.fn(),
}));

vi.mock('@/core/facades/cursorStoreFacade', () => ({
  setCurrentRow: vi.fn(),
}));

vi.mock('@/core/facades/historyFacade', () => ({
  undo: vi.fn(),
  redo: vi.fn(),
}));

// i18nのモック
vi.mock('react-i18next', () => ({
  useTranslation: (): { t: (_key: string, _fallback: string) => string } => ({
    t: (_key: string, fallback: string): string => fallback,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Tableコンポーネントのモック
vi.mock('@/components/organisms/Table', () => {
  return {
    Table: ({
      data = [],
      currentRow = 0,
      buttonPosition = 'left',
      onMoveUp = () => {},
      onMoveDown = () => {},
      onRowSelect = () => {},
      isEditMode = false,
      onCellEdit = () => {},
      onDeleteRow = () => {},
      onAddRow = () => {},
      onPasteRows = () => {},
    }: {
      data?: Action[];
      currentRow?: number;
      buttonPosition?: string;
      onMoveUp?: () => void;
      onMoveDown?: () => void;
      onRowSelect?: (_row: number) => void;
      isEditMode?: boolean;
      onCellEdit?: (_row: number, _field: keyof Action, _value: string) => void;
      onDeleteRow?: (_row: number) => void;
      onAddRow?: (_row: number) => void;
      onPasteRows?: (_row: number, _rows: Partial<Action>[]) => void;
    } = {}): JSX.Element => (
      <div data-testid="table">
        <div data-testid="table-data">
          {Array.isArray(data) && data.map((row: Action, index: number) => (
            <div key={index} data-testid={`row-${index}`}>
              {Object.entries(row).map(([key, value]) => (
                <span key={key} data-testid={`cell-${index}-${key}`}>
                  {key}: {value}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div data-testid="table-current-row">{String(currentRow)}</div>
        <div data-testid="table-button-position">{String(buttonPosition)}</div>
        <div data-testid="table-edit-mode">{isEditMode ? 'true' : 'false'}</div>
        <button data-testid="move-up-button" onClick={onMoveUp}>
          上へ移動
        </button>
        <button data-testid="move-down-button" onClick={onMoveDown}>
          下へ移動
        </button>
        <button data-testid="select-row-button" onClick={() => onRowSelect(1)}>
          行を選択
        </button>
        <button data-testid="edit-cell-button" onClick={() => onCellEdit(0, 'action', '新しいアクション')}>
          セルを編集
        </button>
        <button data-testid="delete-row-button" onClick={() => onDeleteRow(0)}>
          行を削除
        </button>
        <button data-testid="add-row-button" onClick={() => onAddRow(0)}>
          行を追加
        </button>
        <button
          data-testid="paste-rows-button"
          onClick={() => onPasteRows(0, [{ action: 'ペーストされたアクション' }])}
        >
          行をペースト
        </button>
      </div>
    ),
  };
});

// cursorStoreのモック
vi.mock('@/core/stores/cursorStore', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    currentRow: mockCurrentRow,
    setCurrentRow: vi.fn(),
  })),
}));

// flowStoreのモック
vi.mock('@/core/stores/flowStore', () => ({
  default: vi.fn(() => ({
    flowData: currentFlowData,
    setFlowData: vi.fn(),
  })),
}));

// settingsStoreFacadeのモック
vi.mock('@/core/facades/settingsStoreFacade', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    settings: {
      buttonAlignment: 'left',
    },
  })),
}));

// モックの設定後にコンポーネントをインポート
import { TableContainer } from './TableContainer';
// モック化したモジュールからのインポート
import { setCurrentRow } from '@/core/facades/cursorStoreFacade';
import { undo, redo } from '@/core/facades/historyFacade';
import { setFlowData } from '@/core/facades/flowFacade';

// モックデータの定義
const mockFlowData: Flow = {
  title: 'テストフロー',
  quest: 'テストクエスト',
  author: 'テスト作者',
  description: 'テスト説明',
  updateDate: '2023-01-01',
  note: 'テストノート',
  organization: {
    job: {
      name: 'テストジョブ',
      note: 'テストジョブの説明',
      equipment: { name: 'テスト装備', note: 'テスト装備の説明' },
      abilities: [],
    },
    member: { front: [], back: [] },
    weapon: {
      main: { name: '', note: '', additionalSkill: '' },
      other: [],
      additional: [],
    },
    weaponEffects: { taRate: '', hp: '', defense: '' },
    summon: {
      main: { name: '', note: '' },
      friend: { name: '', note: '' },
      other: [],
      sub: [],
    },
    totalEffects: { taRate: '', hp: '', defense: '' },
  },
  always: '',
  flow: [
    {
      hp: '100%',
      prediction: '予兆1',
      charge: '◯',
      guard: '×',
      action: 'アクション1',
      note: 'ノート1',
    },
    {
      hp: '50%',
      prediction: '予兆2',
      charge: '×',
      guard: '◯',
      action: 'アクション2',
      note: 'ノート2',
    },
  ],
};

let mockCurrentRow = 0;
let currentFlowData: Flow | null = null;

describe('TableContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // document.addEventListenerのモック
    vi.spyOn(document, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(document, 'removeEventListener').mockImplementation(() => {});
    // テスト前にモックをリセット
    mockCurrentRow = 0;
    currentFlowData = mockFlowData;
  });

  it('テーブルが表示されること', () => {
    render(<TableContainer data={mockFlowData.flow} />);

    // テーブルが表示されていることを確認
    expect(screen.getByTestId('table')).toBeInTheDocument();

    // データが正しく渡されていることを確認
    expect(screen.getByTestId('row-0')).toBeInTheDocument();
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.getByTestId('cell-0-action')).toHaveTextContent('action: アクション1');
    expect(screen.getByTestId('cell-1-action')).toHaveTextContent('action: アクション2');

    // 現在の行が正しく設定されていることを確認
    expect(screen.getByTestId('table-current-row')).toHaveTextContent('0');

    // ボタン位置が正しく設定されていることを確認
    expect(screen.getByTestId('table-button-position')).toHaveTextContent('left');

    // 編集モードが正しく設定されていることを確認
    expect(screen.getByTestId('table-edit-mode')).toHaveTextContent('false');
  });

  it('編集モードが正しく設定されること', () => {
    render(<TableContainer isEditMode={true} data={mockFlowData.flow} />);

    // 編集モードが正しく設定されていることを確認
    expect(screen.getByTestId('table-edit-mode')).toHaveTextContent('true');
  });

  it('カスタムデータが渡された場合、そのデータが使用されること', () => {
    const customData: Action[] = [
      {
        hp: '25%',
        prediction: 'カスタム予兆',
        charge: '△',
        guard: '△',
        action: 'カスタムアクション',
        note: 'カスタムノート',
      },
    ];

    render(<TableContainer data={customData} />);

    // カスタムデータが表示されていることを確認
    expect(screen.getByTestId('cell-0-action')).toHaveTextContent('action: カスタムアクション');
  });

  it('flowDataがnullの場合、nullを返すこと', () => {
    // flowDataをnullに設定
    currentFlowData = null;

    // 明示的にdataプロパティを渡さないようにする
    const { container } = render(<TableContainer />);

    // 何も表示されないことを確認
    expect(container.firstChild).toBeNull();
  });

  it('行を選択するとsetCurrentRowが呼ばれること', () => {
    render(<TableContainer data={mockFlowData.flow} />);

    // 行選択ボタンをクリック
    const selectButton = screen.getByTestId('select-row-button');
    fireEvent.click(selectButton);

    // setCurrentRowが呼ばれたことを確認
    expect(setCurrentRow).toHaveBeenCalledTimes(1);
    expect(setCurrentRow).toHaveBeenCalledWith(1);
  });

  it('上へ移動ボタンをクリックするとhandleMoveUpが呼ばれること', () => {
    // currentRowを1に設定
    mockCurrentRow = 1;

    render(<TableContainer data={mockFlowData.flow} />);

    // 上へ移動ボタンをクリック
    const moveUpButton = screen.getByTestId('move-up-button');
    fireEvent.click(moveUpButton);

    // setCurrentRowが呼ばれたことを確認
    expect(setCurrentRow).toHaveBeenCalledTimes(1);
    expect(setCurrentRow).toHaveBeenCalledWith(0);
  });

  it('下へ移動ボタンをクリックするとhandleMoveDownが呼ばれること', () => {
    render(<TableContainer data={mockFlowData.flow} />);

    // 下へ移動ボタンをクリック
    const moveDownButton = screen.getByTestId('move-down-button');
    fireEvent.click(moveDownButton);

    // setCurrentRowが呼ばれたことを確認
    expect(setCurrentRow).toHaveBeenCalledTimes(1);
    expect(setCurrentRow).toHaveBeenCalledWith(1);
  });

  it('セルを編集するとhandleCellEditが呼ばれること', () => {
    render(<TableContainer data={mockFlowData.flow} />);

    // セル編集ボタンをクリック
    const editCellButton = screen.getByTestId('edit-cell-button');
    fireEvent.click(editCellButton);

    // setFlowDataが呼ばれたことを確認
    expect(setFlowData).toHaveBeenCalledTimes(1);
    // 新しいフローデータで呼ばれたことを確認
    expect(setFlowData).toHaveBeenCalledWith(expect.objectContaining({
      flow: expect.arrayContaining([
        expect.objectContaining({
          action: '新しいアクション'
        }) as Action
      ]) as Action[]
    }));
  });

  it('行を削除するとhandleDeleteRowが呼ばれること', () => {
    render(<TableContainer data={mockFlowData.flow} />);

    // 行削除ボタンをクリック
    const deleteRowButton = screen.getByTestId('delete-row-button');
    fireEvent.click(deleteRowButton);

    // setFlowDataが呼ばれたことを確認
    expect(setFlowData).toHaveBeenCalledTimes(1);
    // 新しいフローデータで呼ばれたことを確認（最初の行が削除されている）
    expect(setFlowData).toHaveBeenCalledWith(expect.objectContaining({
      flow: expect.arrayContaining([
        expect.objectContaining({
          action: 'アクション2'
        }) as Action
      ]) as Action[]
    }));

    // 削除後のフローの長さが1になっていることを確認
    const mockCall = setFlowData.mock.calls[0]?.[0] as Flow;
    expect(mockCall?.flow?.length).toBe(1);
  });

  it('行を追加するとhandleAddRowが呼ばれること', () => {
    render(<TableContainer data={mockFlowData.flow} />);

    // 行追加ボタンをクリック
    const addRowButton = screen.getByTestId('add-row-button');
    fireEvent.click(addRowButton);

    // setFlowDataが呼ばれたことを確認
    expect(setFlowData).toHaveBeenCalledTimes(1);
    // 新しいフローデータで呼ばれたことを確認（新しい行が追加されている）
    expect(setFlowData).toHaveBeenCalledWith(expect.objectContaining({
      flow: expect.arrayContaining([
        expect.objectContaining({
          action: 'アクション1'
        }) as Action,
        expect.objectContaining({
          hp: '',
          prediction: '',
          charge: '',
          guard: '',
          action: '',
          note: '',
        }) as Action,
        expect.objectContaining({
          action: 'アクション2'
        }) as Action
      ]) as Action[]
    }));

    // 追加後のフローの長さが3になっていることを確認
    const mockCall = setFlowData.mock.calls[0]?.[0] as Flow;
    expect(mockCall?.flow?.length).toBe(3);

    // 追加した行を選択していることを確認
    expect(setCurrentRow).toHaveBeenCalledWith(1);
  });

  it('行をペーストするとhandlePasteRowsが呼ばれること', () => {
    render(<TableContainer data={mockFlowData.flow} />);

    // 行ペーストボタンをクリック
    const pasteRowsButton = screen.getByTestId('paste-rows-button');
    fireEvent.click(pasteRowsButton);

    // setFlowDataが呼ばれたことを確認
    expect(setFlowData).toHaveBeenCalledTimes(1);
    // 新しいフローデータで呼ばれたことを確認（ペーストされた行が追加されている）
    expect(setFlowData).toHaveBeenCalledWith(expect.objectContaining({
      flow: expect.arrayContaining([
        expect.objectContaining({
          action: 'ペーストされたアクション'
        }) as Action,
        expect.objectContaining({
          action: 'アクション2'
        }) as Action
      ]) as Action[]
    }));
  });
});