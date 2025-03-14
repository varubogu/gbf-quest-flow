import type { Flow, Action } from '@/types/models';

// 各機能別のストア用インターフェース
// 基本的なフロー状態管理
export interface FlowStore {
  flowData: Flow | null;
  originalData: Flow | null;
  getFlowData: () => Flow | null;
  getActionById: (_index: number) => Action | undefined;
  setFlowData: (_data: Flow | null) => void;
}

// 編集モード管理
export interface EditModeStore {
  isEditMode: boolean;
  getIsEditMode: () => boolean;
  setIsEditMode: (_isEdit: boolean) => void;
  startEdit: () => void;
  endEdit: () => void;
}

// カーソル位置管理
export interface CursorStore {
  currentRow: number;
  setCurrentRow: (_row: number) => void;
}

// ファイル操作関連
export interface FileOperationMethods {
  loadFlowFromFile: () => Promise<void>;
  saveFlowToFile: (_fileName?: string) => Promise<void>;
}

// 完全なFlowStoreのインターフェース（分割後のファサード用）
export interface SummaryFlowStore extends
  FlowStore,
  EditModeStore,
  CursorStore,
  FileOperationMethods {}