import type { Flow } from '@/types/models';
import type { EditModeStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import organizationSettings from '@/content/settings/organization.json';
import useErrorStore from './errorStore';
import { clearHistory } from '@/core/services/historyService';
import useFlowStore from './flowStore';
import useCursorStore from './cursorStore';

/**
 * 編集モードの状態管理を行うストア
 */
const useEditModeStore = create<EditModeStore>((set, get) => ({
  // 状態
  isEditMode: false,

  // ゲッター
  getIsEditMode: (): boolean => get().isEditMode,

  // 編集モードの設定
  setIsEditMode: (isEdit: boolean): void => {
    try {
      const flowData = useFlowStore.getState().getFlowData();

      if (isEdit && flowData) {
        // 編集モード開始時に現在のデータをflowStoreのoriginalDataとして保存
        useFlowStore.setState({ originalData: structuredClone(flowData) });
      }

      if (!isEdit) {
        // 編集モード終了時に履歴をクリア
        clearHistory();
        useFlowStore.setState({ originalData: null });
      }

      set({ isEditMode: isEdit });
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('編集モードの設定中にエラーが発生しました')
        );
    }
  },

  // 編集キャンセル
  cancelEdit: (): void => {
    try {
      const originalData = useFlowStore.getState().originalData;
      if (originalData) {
        set({ isEditMode: false });

        // 元のデータに戻す
        useFlowStore.setState({
          flowData: structuredClone(originalData),
          originalData: null
        });

        // 履歴をクリア
        clearHistory();

        // 履歴を戻る（popstateイベントが発火してデータが復元される）
        history.back();
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('編集のキャンセル中にエラーが発生しました')
        );
    }
  },

  // 新規フロー作成
  createNewFlow: (): void => {
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
      set({ isEditMode: true });

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
          error instanceof Error ? error : new Error('新規フロー作成中にエラーが発生しました')
        );
    }
  },
}));

export default useEditModeStore;