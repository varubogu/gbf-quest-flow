import type { Flow, Action } from '@/types/models';
import type { FlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';

/**
 * @deprecated このモジュールは非推奨です。代わりに flowStoreFacade を使用してください。
 * このモジュールは将来のバージョンで削除される予定です。
 *
 * 重要: コンポーネントからは直接このストアを使用せず、flowStoreFacadeを使用してください。
 * 例: import useFlowStoreFacade from '@/core/stores/flowStoreFacade';
 */

// 非推奨警告を表示する関数
function showDeprecationWarning(methodName: string): void {
  console.warn(
    `flowStore.${methodName}() は非推奨です。代わりに flowStoreFacade.${methodName}() を使用してください。`
  );
}

const useFlowStore = create<FlowStore>((set, get) => ({
  // 状態（プロパティ）
  flowData: null,
  originalData: null,
  currentRow: 0,
  isEditMode: false,

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.setCurrentRow を使用してください。
   */
  setCurrentRow: (row: number): void => {
    showDeprecationWarning('setCurrentRow');
    set({ currentRow: row });
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.setIsEditMode を使用してください。
   */
  setIsEditMode: (isEdit: boolean): void => {
    showDeprecationWarning('setIsEditMode');
    set({
      isEditMode: isEdit,
      originalData: isEdit ? structuredClone(get().flowData) : null
    });
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.createNewFlow を使用してください。
   */
  createNewFlow: (): void => {
    showDeprecationWarning('createNewFlow');
    // 最小限の実装のみ残す
    set({
      flowData: {
        title: '新しいフロー',
        quest: '',
        author: '',
        description: '',
        updateDate: new Date().toISOString(),
        note: '',
        organization: {
          job: { name: '', note: '', equipment: { name: '', note: '' }, abilities: [] },
          member: { front: [], back: [] },
          weapon: { main: { name: '', note: '', additionalSkill: '' }, other: [], additional: [] },
          weaponEffects: { taRate: '', hp: '', defense: '' },
          summon: { main: { name: '', note: '' }, friend: { name: '', note: '' }, other: [], sub: [] },
          totalEffects: { taRate: '', hp: '', defense: '' }
        },
        always: '',
        flow: [{ hp: '', prediction: '', charge: '', guard: '', action: '', note: '' }]
      },
      currentRow: 0,
      isEditMode: true
    });
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.setFlowData を使用してください。
   */
  setFlowData: (data: Flow | null): void => {
    showDeprecationWarning('setFlowData');
    set({
      flowData: data,
      currentRow: 0
    });
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.updateFlowData を使用してください。
   */
  updateFlowData: (updates: Partial<Flow>): void => {
    showDeprecationWarning('updateFlowData');
    const currentData = get().flowData;
    if (!currentData) return;

    set({
      flowData: { ...currentData, ...updates }
    });
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに historyService.pushToHistory を使用してください。
   */
  pushToHistory: (_data: Flow): void => {
    showDeprecationWarning('pushToHistory');
    // 実装なし - 警告のみ
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに historyService.undo を使用してください。
   */
  undo: (): void => {
    showDeprecationWarning('undo');
    // 実装なし - 警告のみ
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに historyService.redo を使用してください。
   */
  redo: (): void => {
    showDeprecationWarning('redo');
    // 実装なし - 警告のみ
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに historyService.clearHistory を使用してください。
   */
  clearHistory: (): void => {
    showDeprecationWarning('clearHistory');
    // 実装なし - 警告のみ
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.cancelEdit を使用してください。
   */
  cancelEdit: (): void => {
    showDeprecationWarning('cancelEdit');
    const { originalData } = get();
    if (originalData) {
      set({
        flowData: structuredClone(originalData),
        isEditMode: false,
        originalData: null
      });
    }
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに fileService.loadFlowFromFile を使用してください。
   */
  loadFlowFromFile: async (): Promise<void> => {
    showDeprecationWarning('loadFlowFromFile');
    try {
      // fileServiceのloadFlowFromFileを呼び出す
      const { loadFlowFromFile } = await import('../services/fileService');
      await loadFlowFromFile();
    } catch (error) {
      console.error('ファイルの読み込みに失敗しました', error);
    }
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.updateAction を使用してください。
   */
  updateAction: (index: number, updates: Partial<Action>): void => {
    showDeprecationWarning('updateAction');
    const currentData = get().flowData;
    if (!currentData) return;

    const newFlow = [...currentData.flow];
    const existingAction = newFlow[index] || { hp: '', prediction: '', charge: '', guard: '', action: '', note: '' };
    newFlow[index] = {
      hp: existingAction.hp || '',
      prediction: existingAction.prediction || '',
      charge: existingAction.charge || '',
      guard: existingAction.guard || '',
      action: existingAction.action || '',
      note: existingAction.note || '',
      ...updates
    };

    set({
      flowData: { ...currentData, flow: newFlow }
    });
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.getFlowData を使用してください。
   */
  getFlowData: (): Flow | null => {
    showDeprecationWarning('getFlowData');
    return get().flowData;
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.getActionById を使用してください。
   */
  getActionById: (index: number): Action | undefined => {
    showDeprecationWarning('getActionById');
    return get().flowData?.flow[index];
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.getIsEditMode を使用してください。
   */
  getIsEditMode: (): boolean => {
    showDeprecationWarning('getIsEditMode');
    return get().isEditMode;
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに flowStoreFacade.getCurrentRow を使用してください。
   */
  getCurrentRow: (): number => {
    showDeprecationWarning('getCurrentRow');
    return get().currentRow;
  },

  /**
   * @deprecated このメソッドは非推奨です。代わりに fileService.saveFlowToFile を使用してください。
   */
  saveFlowToFile: async (fileName?: string): Promise<void> => {
    showDeprecationWarning('saveFlowToFile');
    try {
      // fileServiceのsaveFlowToFileを呼び出す
      const { saveFlowToFile } = await import('../services/fileService');
      await saveFlowToFile(fileName);
    } catch (error) {
      console.error('ファイルの保存に失敗しました', error);
    }
  },
}));

export default useFlowStore;
