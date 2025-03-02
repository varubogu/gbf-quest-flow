import type { Flow, Action } from '@/types/models';

// 各機能別のストア用インターフェース
// 基本的なフロー状態管理
export interface BaseFlowStore {
  flowData: Flow | null;
  originalData: Flow | null;
  getFlowData: () => Flow | null;
  getActionById: (_index: number) => Action | undefined;
  setFlowData: (_data: Flow | null) => void;
  updateFlowData: (_updates: Partial<Flow>) => void;
  updateAction: (_index: number, _updates: Partial<Action>) => void;
  // 内部メソッド - flowServiceからのみ使用される
  _updateState: (_newData: Flow) => void;
}

// 編集モード管理
export interface EditModeStore {
  isEditMode: boolean;
  getIsEditMode: () => boolean;
  setIsEditMode: (_isEdit: boolean) => void;
  cancelEdit: () => void;
  createNewFlow: () => void;
}

// カーソル位置管理
export interface CursorStore {
  currentRow: number;
  setCurrentRow: (_row: number) => void;
  getCurrentRow: () => number;
}

// ファイル操作関連
export interface FileOperationMethods {
  loadFlowFromFile: () => Promise<void>;
  saveFlowToFile: (_fileName?: string) => Promise<void>;
}

// 非推奨の履歴関連機能（後方互換性のため残す）
export interface DeprecatedHistoryMethods {
  // @deprecated - historyStoreを直接使用してください
  pushToHistory: (_data: Flow) => void;
  // @deprecated - historyStoreを直接使用してください
  undo: () => void;
  // @deprecated - historyStoreを直接使用してください
  redo: () => void;
  // @deprecated - historyStoreを直接使用してください
  clearHistory: () => void;
}

// 完全なFlowStoreのインターフェース（分割後のファサード用）
export interface FlowStore extends
  BaseFlowStore,
  EditModeStore,
  CursorStore,
  FileOperationMethods,
  DeprecatedHistoryMethods {}