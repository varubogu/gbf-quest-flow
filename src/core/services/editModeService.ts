import type { Flow } from '@/types/models';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import useCursorStore from '@/core/stores/cursorStore';
import { clearHistory } from './historyService';
import organizationSettings from '@/content/settings/organization.json';
import { errorFactory } from '@/core/services/errorService';
import useErrorStore from '@/core/stores/errorStore';
import { setFlowData } from '@/core/services/flowService';

/**
 * 編集モード関連のサービス
 *
 * このサービスは、編集モードの開始・終了・キャンセルなどの機能を提供します。
 */

export function getIsEditMode(): boolean {
  return useEditModeStore.getState().getIsEditMode();
}

/**
 * 編集モードを開始する
 *
 * 現在のデータを保存し、編集モードをオンにします。
 * @param isEdit 編集モードにするかどうか
 */
export function startEditMode(isEdit: boolean): void {
  try {
    const flowData = useFlowStore.getState().getFlowData();

    if (isEdit && flowData) {
      // 編集モード開始時の処理
      const originalData = structuredClone(flowData);
      useFlowStore.setState({ originalData });
    }

    if (!isEdit) {
      // 編集モード終了時の処理
      clearHistory();
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

/**
 * 編集モードを終了する（保存）
 *
 * 編集内容を保存し、編集モードをオフにします。
 */
export function finishEditMode(): void {
  try {
    // 編集モード終了時の処理
    clearHistory();
    useFlowStore.setState({ originalData: null });
    useEditModeStore.setState({ isEditMode: false });
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        errorFactory.createUnknownError(
          error instanceof Error ? error : new Error('編集モードの終了中にエラーが発生しました')
        )
      );
  }
}

/**
 * 編集モードを終了する（キャンセル）
 *
 * 編集内容を破棄し、元のデータに戻します。
 */
export function cancelEditMode(): void {
  try {
    const originalData = useFlowStore.getState().originalData;
    if (originalData) {
      // 編集キャンセル時の処理
      const clonedData = structuredClone(originalData);

      // flowStoreを更新（flowService経由）
      setFlowData(clonedData);

      // 編集モードをオフにする
      useFlowStore.setState({ originalData: null });
      useEditModeStore.setState({ isEditMode: false });

      // 履歴をクリア
      clearHistory();

      // 履歴を戻る（popstateイベントが発火してデータが復元される）
      history.back();
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

/**
 * 新規フローを作成する
 *
 * 空のデータを作成し、編集モードをオンにします。
 */
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

    // flowStoreの状態を更新（flowService経由）
    setFlowData(newData);
    useFlowStore.setState({ originalData: currentFlowData });

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