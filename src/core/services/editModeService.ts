import type { Flow } from '@/types/models';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import useCursorStore from '@/core/stores/cursorStore';
import { clearHistory } from './historyService';
import organizationSettings from '@/content/settings/organization.json';
import { errorFactory } from '@/core/services/errorService';
import useErrorStore from '@/core/stores/errorStore';

/**
 * 編集モード関連のサービス
 *
 * このサービスは、編集モードの開始・終了・キャンセルなどの機能を提供します。
 */

// ロジック関数 - 編集モード開始時の処理
export function handleEditModeStart(flowData: Flow): { originalData: Flow } {
  // 編集モード開始時に現在のデータを保存
  return { originalData: structuredClone(flowData) };
}

// ロジック関数 - 編集モード終了時の処理
export function handleEditModeEnd(): void {
  // 編集モード終了時に履歴をクリア
  clearHistory();
}

// ロジック関数 - flowStoreとの同期処理
function syncWithFlowStore(data: Flow | null): void {
  useFlowStore.getState().setFlowData(data);
}


// ロジック関数 - 編集キャンセル時の処理
export function handleCancelEdit(originalData: Flow): { flowData: Flow; isEditMode: boolean; originalData: null } {
  // 編集をキャンセルして元のデータに戻す
  const clonedData = structuredClone(originalData);

  // flowStoreも同期
  syncWithFlowStore(clonedData);

  // 履歴をクリア
  clearHistory();

  // 履歴を戻る（popstateイベントが発火してデータが復元される）
  history.back();

  return {
    flowData: clonedData,
    isEditMode: false,
    originalData: null,
  };
}

// 編集モードの設定
export function setIsEditMode(isEdit: boolean): void {
  try {
    const flowData = useFlowStore.getState().getFlowData();

    if (isEdit && flowData) {
      // 編集モード開始時の処理
      const updates = handleEditModeStart(flowData);
      useFlowStore.setState({ originalData: updates.originalData });
    }

    if (!isEdit) {
      // 編集モード終了時の処理
      handleEditModeEnd();
      useFlowStore.setState({ originalData: null });
    }

    useEditModeStore.setState({ isEditMode: isEdit });
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        errorFactory.createUnknownError(
          error instanceof Error ? error : new Error('編集モードの設定中にエラーが発生しました')
        )
      );
  }
}

// 編集のキャンセル
export function cancelEdit(): void {
  try {
    const originalData = useFlowStore.getState().originalData;
    if (originalData) {
      // 編集キャンセル時の処理
      const updates = handleCancelEdit(originalData);
      useFlowStore.setState({ flowData: updates.flowData, originalData: updates.originalData });
      useEditModeStore.setState({ isEditMode: updates.isEditMode });
    }
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        errorFactory.createUnknownError(
          error instanceof Error ? error : new Error('編集のキャンセル中にエラーが発生しました')
        )
      );
  }
}

// 新規フロー作成
export function createNewFlow(): void {
  try {
    // 空のデータを作成
    const newData: Flow = {
      title: '新しいフロー',
      quest: '',
      author: '',
      description: '',
      updateDate: new Date().toISOString(),
      note: '',
      organization: {
        job: {
          name: '',
          note: '',
          equipment: {
            name: '',
            note: '',
          },
          abilities: Array(organizationSettings.job.abilities)
            .fill(null)
            .map(() => ({ name: '', note: '' })),
        },
        member: {
          front: Array(organizationSettings.member.front)
            .fill(null)
            .map(() => ({
              name: '',
              note: '',
              awaketype: '',
              accessories: '',
              limitBonus: '',
            })),
          back: Array(organizationSettings.member.back)
            .fill(null)
            .map(() => ({
              name: '',
              note: '',
              awaketype: '',
              accessories: '',
              limitBonus: '',
            })),
        },
        weapon: {
          main: {
            name: '',
            note: '',
            additionalSkill: '',
          },
          other: Array(organizationSettings.weapon.other)
            .fill(null)
            .map(() => ({
              name: '',
              note: '',
              additionalSkill: '',
            })),
          additional: Array(organizationSettings.weapon.additional)
            .fill(null)
            .map(() => ({
              name: '',
              note: '',
              additionalSkill: '',
            })),
        },
        weaponEffects: {
          taRate: '',
          hp: '',
          defense: '',
        },
        summon: {
          main: { name: '', note: '' },
          friend: { name: '', note: '' },
          other: Array(organizationSettings.summon.other)
            .fill(null)
            .map(() => ({ name: '', note: '' })),
          sub: Array(organizationSettings.summon.sub)
            .fill(null)
            .map(() => ({ name: '', note: '' })),
        },
        totalEffects: {
          taRate: '',
          hp: '',
          defense: '',
        },
      },
      always: '',
      flow: [
        {
          hp: '',
          prediction: '',
          charge: '',
          guard: '',
          action: '',
          note: '',
        },
      ],
    };

    // 現在のデータをoriginalDataとして保持
    const currentFlowData = useFlowStore.getState().getFlowData();

    // historyServiceの履歴をクリア
    clearHistory();

    // 編集モードをオンにする
    useEditModeStore.setState({ isEditMode: true });

    // flowStoreの状態を更新
    useFlowStore.setState({
      flowData: newData,
      originalData: currentFlowData,
    });

    // カーソル位置をリセット
    useCursorStore.setState({
      currentRow: 0
    });
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        errorFactory.createUnknownError(
          error instanceof Error ? error : new Error('新規フロー作成中にエラーが発生しました')
        )
      );
  }
}