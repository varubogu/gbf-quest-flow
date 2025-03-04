import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableContainer } from './TableContainer';
import useFlowStore from '@/core/stores/flowStore';
import useCursorStoreFacade from '@/core/facades/cursorStoreFacade';
import useSettingsStoreFacade from '@/core/facades/settingsStoreFacade';
import { undo, redo } from '@/core/facades/historyFacade';
import type { Flow } from '@/types/models';
import type { Action } from '@/types/types';

// モックの設定
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Tableコンポーネントのモック
vi.mock('./Table', () => ({
  Table: ({
    data,
    currentRow,
    buttonPosition,
    onMoveUp,
    onMoveDown,
    onRowSelect,
    isEditMode,
    onCellEdit,
    onDeleteRow,
    onAddRow,
    onPasteRows,
  }) => (
    <div data-testid="table">
      <div data-testid="table-data">
        {data.map((row, index) => (
          <div key={index} data-testid={`row-${index}`}>
            {Object.entries(row).map(([key, value]) => (
              <span key={key} data-testid={`cell-${index}-${key}`}>
                {key}: {value}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div data-testid="table-current-row">{currentRow}</div>
      <div data-testid="table-button-position">{buttonPosition}</div>
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
}));

vi.mock('@/core/stores/flowStore');
vi.mock('@/core/facades/cursorStoreFacade');
vi.mock('@/core/facades/settingsStoreFacade');
vi.mock('@/core/facades/historyFacade', () => ({
  undo: vi.fn(),
  redo: vi.fn(),
}));

describe('TableContainer', () => {
  // テスト用のモックデータ
  const mockActions: Action[] = [
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
  ];

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
    flow: mockActions,
  };

  const mockSetFlowData = vi.fn();
  const mockCurrentRow = 0;
  const mockSetCurrentRow = vi.fn();
  const mockSettings = { buttonAlignment: 'left' };

  beforeEach(() => {
    vi.clearAllMocks();

    // useFlowStoreのモック
    (useFlowStore as unknown as Mock).mockImplementation((selector: Function) => {
      const state = { flowData: mockFlowData, setFlowData: mockSetFlowData };
      return selector(state);
    });

    // useCursorStoreFacadeのモック
    (useCursorStoreFacade as unknown as Mock).mockImplementation((selector: Function) => {
      const state = { currentRow: mockCurrentRow, setCurrentRow: mockSetCurrentRow };
      return selector(state);
    });

    // useSettingsStoreFacadeのモック
    (useSettingsStoreFacade as unknown as Mock).mockImplementation((selector: Function) => {
      const state = { settings: mockSettings };
      return selector(state);
    });

    // document.addEventListenerのモック
    vi.spyOn(document, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(document, 'removeEventListener').mockImplementation(() => {});
  });

  describe('単体テスト', () => {
    it('テーブルが表示されること', () => {
      render(<TableContainer />);

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
      render(<TableContainer isEditMode={true} />);

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
      (useFlowStore as unknown as Mock).mockImplementation((selector: Function) => {
        const state = { flowData: null, setFlowData: mockSetFlowData };
        return selector(state);
      });

      const { container } = render(<TableContainer />);

      // 何も表示されないことを確認
      expect(container.firstChild).toBeNull();
    });
  });

  describe('結合テスト', () => {
    it('行を選択するとsetCurrentRowが呼ばれること', () => {
      render(<TableContainer />);

      // 行選択ボタンをクリック
      const selectButton = screen.getByTestId('select-row-button');
      fireEvent.click(selectButton);

      // setCurrentRowが呼ばれたことを確認
      expect(mockSetCurrentRow).toHaveBeenCalledTimes(1);
      expect(mockSetCurrentRow).toHaveBeenCalledWith(1);
    });

    it('上へ移動ボタンをクリックするとhandleMoveUpが呼ばれること', () => {
      // currentRowを1に設定
      (useCursorStoreFacade as unknown as Mock).mockImplementation((selector: Function) => {
        const state = { currentRow: 1, setCurrentRow: mockSetCurrentRow };
        return selector(state);
      });

      render(<TableContainer />);

      // 上へ移動ボタンをクリック
      const moveUpButton = screen.getByTestId('move-up-button');
      fireEvent.click(moveUpButton);

      // setCurrentRowが呼ばれたことを確認
      expect(mockSetCurrentRow).toHaveBeenCalledTimes(1);
      expect(mockSetCurrentRow).toHaveBeenCalledWith(0);
    });

    it('下へ移動ボタンをクリックするとhandleMoveDownが呼ばれること', () => {
      render(<TableContainer />);

      // 下へ移動ボタンをクリック
      const moveDownButton = screen.getByTestId('move-down-button');
      fireEvent.click(moveDownButton);

      // setCurrentRowが呼ばれたことを確認
      expect(mockSetCurrentRow).toHaveBeenCalledTimes(1);
      expect(mockSetCurrentRow).toHaveBeenCalledWith(1);
    });

    it('セルを編集するとsetFlowDataが呼ばれること', () => {
      render(<TableContainer isEditMode={true} />);

      // セル編集ボタンをクリック
      const editButton = screen.getByTestId('edit-cell-button');
      fireEvent.click(editButton);

      // setFlowDataが呼ばれたことを確認
      expect(mockSetFlowData).toHaveBeenCalledTimes(1);
      expect(mockSetFlowData).toHaveBeenCalledWith({
        ...mockFlowData,
        flow: [
          {
            ...mockActions[0],
            action: '新しいアクション',
          },
          mockActions[1],
        ],
      });
    });

    it('行を削除するとsetFlowDataとsetCurrentRowが呼ばれること', () => {
      render(<TableContainer isEditMode={true} />);

      // 行削除ボタンをクリック
      const deleteButton = screen.getByTestId('delete-row-button');
      fireEvent.click(deleteButton);

      // setFlowDataが呼ばれたことを確認
      expect(mockSetFlowData).toHaveBeenCalledTimes(1);
      expect(mockSetFlowData).toHaveBeenCalledWith({
        ...mockFlowData,
        flow: [mockActions[1]],
      });

      // currentRowが0なので、setCurrentRowは呼ばれない
      expect(mockSetCurrentRow).not.toHaveBeenCalled();
    });

    it('行を追加するとsetFlowDataとsetCurrentRowが呼ばれること', () => {
      render(<TableContainer isEditMode={true} />);

      // 行追加ボタンをクリック
      const addButton = screen.getByTestId('add-row-button');
      fireEvent.click(addButton);

      // setFlowDataが呼ばれたことを確認
      expect(mockSetFlowData).toHaveBeenCalledTimes(1);
      expect(mockSetFlowData).toHaveBeenCalledWith({
        ...mockFlowData,
        flow: [
          mockActions[0],
          {
            hp: '',
            prediction: '',
            charge: '',
            guard: '',
            action: '',
            note: '',
          },
          mockActions[1],
        ],
      });

      // setCurrentRowが呼ばれたことを確認
      expect(mockSetCurrentRow).toHaveBeenCalledTimes(1);
      expect(mockSetCurrentRow).toHaveBeenCalledWith(1);
    });

    it('行をペーストするとsetFlowDataが呼ばれること', () => {
      render(<TableContainer isEditMode={true} />);

      // 行ペーストボタンをクリック
      const pasteButton = screen.getByTestId('paste-rows-button');
      fireEvent.click(pasteButton);

      // setFlowDataが呼ばれたことを確認
      expect(mockSetFlowData).toHaveBeenCalledTimes(1);
      expect(mockSetFlowData).toHaveBeenCalledWith({
        ...mockFlowData,
        flow: [
          {
            ...mockActions[0],
            action: 'ペーストされたアクション',
          },
          mockActions[1],
        ],
      });
    });

    it('編集モードでキーボードショートカットが設定されること', () => {
      render(<TableContainer isEditMode={true} />);

      // document.addEventListenerが呼ばれたことを確認
      expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});