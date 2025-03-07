import type { Flow, Action } from '@/types/models';
import { setIsEditMode as setIsEditMode_Service } from '@/core/services/editModeService';
import { newFlowDataSync } from '@/core/services/flowDataInitService';
import {
  setFlowData as serviceSetFlowData,
  updateFlowData as serviceUpdateFlowData,
  updateAction as serviceUpdateAction,
} from '@/core/services/flowService';


/**
 * フローストアのファサード
 *
 * このファサードは、フローストアにアクセスするための統一されたインターフェースを提供します。
 * これにより、コンポーネントはストアの実装の詳細から切り離され、データアクセスの方法が変更されても
 * コンポーネント側の変更を最小限に抑えることができます。
 *
 * 注: 更新ロジックはflowServiceに委譲されています。
 */
export function setFlowData(data: Flow | null): void {
  serviceSetFlowData(data);
}

export function updateFlowData(updates: Partial<Flow>): void {
  serviceUpdateFlowData(updates);
}

export function updateAction(index: number, updates: Partial<Action>): void {
  serviceUpdateAction(index, updates);
}

// EditModeStore関連のメソッド
export function setIsEditMode(isEdit: boolean): void {
  // serviceを直接呼び出す
  setIsEditMode_Service(isEdit);
}

// FileEventService関連のメソッド
export function createNewFlow(): void {
  // flowDataInitServiceを使用して新規フローを作成
  newFlowDataSync();
}
