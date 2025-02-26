import type { Flow } from '@/types/models';
import type { EditModeStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import organizationSettings from '@/content/settings/organization.json';
import useErrorStore from './errorStore';
import useHistoryStore from './historyStore';
import useBaseFlowStore from './baseFlowStore';

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
      const flowData = useBaseFlowStore.getState().getFlowData();

      if (isEdit && flowData) {
        // 編集モード開始時に現在のデータをbaseFlowStoreのoriginalDataとして保存
        useBaseFlowStore.setState({ originalData: structuredClone(flowData) });
      }

      if (!isEdit) {
        // 編集モード終了時に履歴をクリア
        useHistoryStore.getState().clearHistory();
        useBaseFlowStore.setState({ originalData: null });
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
      const originalData = useBaseFlowStore.getState().originalData;
      if (originalData) {
        set({ isEditMode: false });

        // 元のデータに戻す
        useBaseFlowStore.setState({
          flowData: structuredClone(originalData),
          originalData: null
        });

        // 履歴をクリア
        useHistoryStore.getState().clearHistory();

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
      const currentFlowData = useBaseFlowStore.getState().getFlowData();

      // historyStoreの履歴をクリア
      useHistoryStore.getState().clearHistory();

      // 編集モードをオンにする
      set({ isEditMode: true });

      // baseFlowStoreの状態を更新
      useBaseFlowStore.setState({
        flowData: newData,
        originalData: currentFlowData,
      });

      // カーソル位置をリセット
      // ※注: cursorStoreが実装されたらここでcursorStoreを更新する

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