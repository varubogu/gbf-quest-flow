import type { Flow, Action } from '@/types/models';
import type { FlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import organizationSettings from '@/content/settings/organization.json';
import useErrorStore from './errorStore';
import useHistoryStore from './historyStore';
import useBaseFlowStore from './baseFlowStore';
import { adjustOrganizationData } from '../services/organizationService';

/**
 * @deprecated このモジュールは非推奨です。代わりに flowStoreFacade を使用してください。
 * このモジュールは将来のバージョンで削除される予定です。
 */

const useFlowStore = create<FlowStore>((set, get) => ({
  flowData: null,
  originalData: null,
  currentRow: 0,
  isEditMode: false,
  // history: { past: [], future: [] }, // 削除 - historyStoreに移行

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.setCurrentRow を使用してください。
   */
  setCurrentRow: (row: number): void => set({ currentRow: row }),

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.setIsEditMode を使用してください。
   */
  setIsEditMode: (isEdit: boolean): void => {
    const { flowData } = get();
    if (isEdit && flowData) {
      // 編集モード開始時に現在のデータを保存
      set({ originalData: structuredClone(flowData) });
    }
    if (!isEdit) {
      // 編集モード終了時に履歴をクリア
      useHistoryStore.getState().clearHistory();
      set({ originalData: null });
    }
    set({ isEditMode: isEdit });
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.createNewFlow を使用してください。
   */
  createNewFlow: (): void => {
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

    // 現在の状態を取得
    const currentState = get();

    // historyStoreの履歴をクリア
    useHistoryStore.getState().clearHistory();

    // 状態を更新（現在の状態を保持しつつ、必要な部分を更新）
    set({
      ...currentState,
      flowData: newData,
      originalData: currentState.flowData || null, // 現在のデータをoriginalDataとして保持
      currentRow: 0,
      isEditMode: true,
    });

    // 更新後の状態を確認
    const updatedState = get();
    if (!updatedState.flowData || !updatedState.isEditMode) {
      console.error('createNewFlow: 状態の更新に失敗しました', updatedState);
    }

    // baseFlowStoreも同期
    useBaseFlowStore.getState().setFlowData(newData);
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.setFlowData を使用してください。
   */
  setFlowData: (data: Flow | null): void => {
    if (data === null) {
      set({ flowData: null, currentRow: 0 });
      // baseFlowStoreも同期
      useBaseFlowStore.getState().setFlowData(null);
      return;
    }

    const adjustedData = {
      ...data,
      organization: adjustOrganizationData(data.organization),
    };
    set({ flowData: adjustedData, currentRow: 0 });

    // baseFlowStoreも同期
    useBaseFlowStore.getState().setFlowData(adjustedData);
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.updateFlowData を使用してください。
   */
  updateFlowData: (updates: Partial<Flow>): void => {
    try {
      const currentData = get().flowData;
      const { isEditMode } = get();
      if (!currentData) return;

      // 新しいデータを作成
      const newData = {
        ...currentData,
        ...updates,
      };

      // 現在のデータと新しいデータが異なる場合のみ処理を続行
      if (JSON.stringify(currentData) === JSON.stringify(newData)) {
        return;
      }

      // 変更後のデータを設定
      set({
        flowData: newData,
      });

      // baseFlowStoreも同期
      useBaseFlowStore.getState().updateFlowData(updates);

      // 編集モード中のみ履歴に追加（変更後のデータを保存）
      if (isEditMode) {
        // 非推奨のget().pushToHistoryを使用せず、直接historyStoreを使用
        useHistoryStore.getState().pushToHistory(structuredClone(newData));
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('データの更新中にエラーが発生しました')
        );
    }
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに historyFacade.pushToHistory を使用してください。
   */
  pushToHistory: (data: Flow): void => {
    // historyStoreに委譲
    // このメソッドは非推奨です - 代わりに直接historyStoreを使用してください
    useHistoryStore.getState().pushToHistory(data);
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに historyFacade.undo を使用してください。
   */
  undo: (): void => {
    // このメソッドは非推奨です - 代わりに直接historyStoreを使用してください
    useHistoryStore.getState().undo();
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに historyFacade.redo を使用してください。
   */
  redo: (): void => {
    // このメソッドは非推奨です - 代わりに直接historyStoreを使用してください
    useHistoryStore.getState().redo();
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに historyFacade.clearHistory を使用してください。
   */
  clearHistory: (): void => {
    // このメソッドは非推奨です - 代わりに直接historyStoreを使用してください
    // historyStoreに委譲
    useHistoryStore.getState().clearHistory();
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.cancelEdit を使用してください。
   */
  cancelEdit: (): void => {
    const { originalData } = get();
    if (originalData) {
      set({
        isEditMode: false,
        flowData: structuredClone(originalData),
        originalData: null,
      });

      // baseFlowStoreも同期
      useBaseFlowStore.getState().setFlowData(structuredClone(originalData));

      // 履歴をクリア
      useHistoryStore.getState().clearHistory();
      // 履歴を戻る（popstateイベントが発火してデータが復元される）
      history.back();
    }
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに fileOService.loadFlowFromFile を使用してください。
   */
  loadFlowFromFile: async (): Promise<void> => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      const filePromise = new Promise<File | null>((resolve) => {
        window.addEventListener(
          'focus',
          () => {
            setTimeout(() => {
              if (!input.files?.length) {
                resolve(null);
              }
            }, 300);
          },
          { once: true }
        );

        input.onchange = (e: Event): void => {
          const file = (e.target as HTMLInputElement).files?.[0];
          resolve(file || null);
        };
      });

      input.click();
      const file = await filePromise;

      if (!file) {
        return;
      }

      const text = await file.text();
      const data = JSON.parse(text) as Flow;
      useFlowStore.getState().setFlowData(data); // 分離した関数を使用
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('ファイルの読み込み中にエラーが発生しました')
        );
      throw error;
    }
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.updateAction を使用してください。
   */
  updateAction: (index: number, updates: Partial<Action>): void => {
    try {
      const currentData = get().flowData;
      if (!currentData) return;

      const newFlow = [...currentData.flow];
      newFlow[index] = {
        hp: newFlow[index]?.hp || '',
        prediction: newFlow[index]?.prediction || '',
        charge: newFlow[index]?.charge || '',
        guard: newFlow[index]?.guard || '',
        action: newFlow[index]?.action || '',
        note: newFlow[index]?.note || '',
        ...updates,
      };

      const newData = {
        ...currentData,
        flow: newFlow,
      };

      set({
        flowData: newData,
      });

      // baseFlowStoreも同期
      useBaseFlowStore.getState().updateAction(index, updates);

      // 編集モード中のみ履歴に追加
      if (get().isEditMode) {
        useHistoryStore.getState().pushToHistory(structuredClone(newData));
      }
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('アクションの更新中にエラーが発生しました')
        );
    }
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.getFlowData を使用してください。
   */
  getFlowData: (): Flow | null => get().flowData,

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.getActionById を使用してください。
   */
  getActionById: (index: number): Action | undefined => get().flowData?.flow[index],

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.getIsEditMode を使用してください。
   */
  getIsEditMode: (): boolean => get().isEditMode,

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.getCurrentRow を使用してください。
   */
  getCurrentRow: (): number => get().currentRow,

  /**
   * @deprecated このメソッドは非推奨です。代わりに fileOService.saveFlowToFile を使用してください。
   */
  saveFlowToFile: async (fileName?: string): Promise<void> => {
    try {
      const currentData = get().flowData;
      if (!currentData) {
        throw new Error('保存するデータがありません');
      }

      // JSONデータを生成
      const jsonData = JSON.stringify(currentData, null, 2);

      // Blobを作成
      const blob = new Blob([jsonData], { type: 'application/json' });

      // ダウンロードリンクを作成
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // ファイル名を設定（指定がない場合はフローのタイトルを使用）
      const defaultFileName = `${currentData.title || 'flow'}.json`;
      link.download = fileName || defaultFileName;

      // リンクをクリックしてダウンロードを開始
      document.body.appendChild(link);
      link.click();

      // クリーンアップ
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('ファイルの保存中にエラーが発生しました')
        );
      throw error;
    }
  },
}));

export default useFlowStore;
