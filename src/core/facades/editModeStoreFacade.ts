import {
   getIsEditMode as getIsEditModeService,
   startEdit as startEditService,
   cancelEdit as cancelEditService,
   finishEdit as finishEditService,
   createNewFlow as createNewFlowService,
   setIsEditMode as setIsEditModeService
} from '@/core/services/editModeService';

/**
 * 編集モードストアのファサード
 *
 * このファサードは、編集モードストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 */
export function getIsEditMode(): boolean {
  return getIsEditModeService();
}

export function setIsEditMode(isEdit: boolean): void {
  setIsEditModeService(isEdit);
}

export function startEdit(): void {
  startEditService();
}

export function finishEdit(): void {
  finishEditService();
}

export function cancelEdit(): void {
  cancelEditService();
}

export function createNewFlow(): void {
  createNewFlowService();
}
