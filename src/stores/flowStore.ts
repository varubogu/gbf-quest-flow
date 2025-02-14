import type { Flow, Action } from "@/types/models"
import type { OrganizationSettings } from "@/types/settings"
import { create } from "zustand"
import organizationSettings from "@/content/settings/organization.json"
import useErrorStore from './errorStore'

interface HistoryState {
  past: Flow[];
  future: Flow[];
}

interface FlowStore {
  flowData: Flow | null
  originalData: Flow | null // 編集前のデータを保持
  setFlowData: (newData: Flow | null) => void
  updateFlowData: (update: Partial<Flow>) => void
  loadFlowFromFile: () => Promise<void>
  createNewFlow: () => void // 新しいデータを作成する関数を追加
  currentRow: number
  setCurrentRow: (row: number) => void
  isEditMode: boolean
  setIsEditMode: (isEdit: boolean) => void
  // 履歴管理用の状態と関数
  history: HistoryState
  pushToHistory: (data: Flow) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
  // 編集キャンセル用の関数
  cancelEdit: () => void
  updateAction: (index: number, updates: Partial<Action>) => void
}

// データの個数を設定に合わせて調整する関数（不足分のみ追加）
const adjustArrayLength = <T>(array: T[], targetLength: number, createEmpty: () => T): T[] => {
  if (array.length < targetLength) {
    // 不足分を追加
    return [...array, ...Array(targetLength - array.length).fill(null).map(createEmpty)];
  }
  // 既存のデータはそのまま保持
  return array;
};

// 組織データを設定に合わせて調整する関数（既存データは保持）
const adjustOrganizationData = (organization: Flow['organization']): Flow['organization'] => {
  const emptyMember = () => ({
    name: "",
    note: "",
    awaketype: "",
    accessories: "",
    limitBonus: ""
  });

  const emptyWeapon = () => ({
    name: "",
    note: "",
    additionalSkill: ""
  });

  const emptySummon = () => ({
    name: "",
    note: ""
  });

  const emptyAbility = () => ({
    name: "",
    note: ""
  });

  // 設定値と実際のデータ数の大きい方を使用
  const getTargetLength = (current: number, setting: number) => Math.max(current, setting);

  return {
    ...organization,
    job: {
      ...organization.job,
      abilities: adjustArrayLength(
        organization.job.abilities,
        getTargetLength(organization.job.abilities.length, organizationSettings.job.abilities),
        emptyAbility
      )
    },
    member: {
      front: adjustArrayLength(
        organization.member.front,
        getTargetLength(organization.member.front.length, organizationSettings.member.front),
        emptyMember
      ),
      back: adjustArrayLength(
        organization.member.back,
        getTargetLength(organization.member.back.length, organizationSettings.member.back),
        emptyMember
      )
    },
    weapon: {
      ...organization.weapon,
      other: adjustArrayLength(
        organization.weapon.other,
        getTargetLength(organization.weapon.other.length, organizationSettings.weapon.other),
        emptyWeapon
      ),
      additional: adjustArrayLength(
        organization.weapon.additional,
        getTargetLength(organization.weapon.additional.length, organizationSettings.weapon.additional),
        emptyWeapon
      )
    },
    summon: {
      ...organization.summon,
      other: adjustArrayLength(
        organization.summon.other,
        getTargetLength(organization.summon.other.length, organizationSettings.summon.other),
        emptySummon
      ),
      sub: adjustArrayLength(
        organization.summon.sub,
        getTargetLength(organization.summon.sub.length, organizationSettings.summon.sub),
        emptySummon
      )
    }
  };
};

const useFlowStore = create<FlowStore>((set, get) => ({
  flowData: null,
  originalData: null,
  currentRow: 0,
  isEditMode: false,
  history: { past: [], future: [] },

  setCurrentRow: (row: number) => set({ currentRow: row }),

  setIsEditMode: (isEdit: boolean) => {
    const { flowData } = get();
    if (isEdit && flowData) {
      // 編集モード開始時に現在のデータを保存
      set({ originalData: structuredClone(flowData) });
    }
    if (!isEdit) {
      // 編集モード終了時に履歴をクリア
      set({ history: { past: [], future: [] }, originalData: null });
    }
    set({ isEditMode: isEdit });
  },

  createNewFlow: () => {
    // 空のデータを作成
    const newData: Flow = {
      title: "新しいフロー",
      quest: "",
      author: "",
      description: "",
      updateDate: new Date().toISOString(),
      note: "",
      organization: {
        job: {
          name: "",
          note: "",
          equipment: {
            name: "",
            note: ""
          },
          abilities: Array(organizationSettings.job.abilities).fill(null).map(() => ({ name: "", note: "" }))
        },
        member: {
          front: Array(organizationSettings.member.front).fill(null).map(() => ({
            name: "",
            note: "",
            awaketype: "",
            accessories: "",
            limitBonus: ""
          })),
          back: Array(organizationSettings.member.back).fill(null).map(() => ({
            name: "",
            note: "",
            awaketype: "",
            accessories: "",
            limitBonus: ""
          }))
        },
        weapon: {
          main: {
            name: "",
            note: "",
            additionalSkill: ""
          },
          other: Array(organizationSettings.weapon.other).fill(null).map(() => ({
            name: "",
            note: "",
            additionalSkill: ""
          })),
          additional: Array(organizationSettings.weapon.additional).fill(null).map(() => ({
            name: "",
            note: "",
            additionalSkill: ""
          }))
        },
        weaponEffects: {
          taRate: "",
          hp: "",
          defense: ""
        },
        summon: {
          main: { name: "", note: "" },
          friend: { name: "", note: "" },
          other: Array(organizationSettings.summon.other).fill(null).map(() => ({ name: "", note: "" })),
          sub: Array(organizationSettings.summon.sub).fill(null).map(() => ({ name: "", note: "" }))
        },
        totalEffects: {
          taRate: "",
          hp: "",
          defense: ""
        }
      },
      always: "",
      flow: [{
        hp: "",
        prediction: "",
        charge: "",
        guard: "",
        action: "",
        note: "",
      }],
    };

    // 現在の状態を取得
    const currentState = get();

    // 状態を更新（現在の状態を保持しつつ、必要な部分を更新）
    set({
      ...currentState,
      flowData: newData,
      originalData: null,
      currentRow: 0,
      isEditMode: true,
      history: { past: [], future: [] }
    });

    // 更新後の状態を確認
    const updatedState = get();
    if (!updatedState.flowData || !updatedState.isEditMode) {
      console.error('createNewFlow: 状態の更新に失敗しました', updatedState);
    }
  },

  setFlowData: (newData: Flow | null) => {
    const { isEditMode } = get();
    if (newData) {
      // データの個数を調整
      const adjustedData = {
        ...newData,
        organization: adjustOrganizationData(newData.organization)
      };
      if (isEditMode) {
        // 編集モード中は履歴に追加
        get().pushToHistory(adjustedData);
      }
      set({ flowData: adjustedData, currentRow: 0 });
    } else {
      set({ flowData: null, currentRow: 0 });
    }
  },

  updateFlowData: (updates: Partial<Flow>) => {
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

      // 編集モード中のみ履歴に追加（変更後のデータを保存）
      if (isEditMode) {
        get().pushToHistory(structuredClone(newData));
      }

    } catch (error) {
      useErrorStore.getState().showError(error instanceof Error ? error : new Error('データの更新中にエラーが発生しました'));
    }
  },

  pushToHistory: (data: Flow) => {
    const { history } = get();

    // 最後の履歴と同じデータは追加しない
    if (history.past.length > 0 &&
        JSON.stringify(history.past[history.past.length - 1]) === JSON.stringify(data)) {
      return;
    }

    set({
      history: {
        past: [...history.past, structuredClone(data)],
        future: [], // 新しい変更時に未来履歴をクリア
      },
    });
  },

  undo: () => {
    const { history, flowData, originalData } = get();

    if (!flowData) {
      return;
    }

    // 履歴が空の場合は初期データに戻る
    if (history.past.length === 0) {
      if (originalData && JSON.stringify(flowData) !== JSON.stringify(originalData)) {
        set({
          flowData: structuredClone(originalData),
          history: { past: [], future: [flowData, ...history.future] }
        });
      }
      return;
    }

    // 最後の履歴を取得してpop
    const currentState = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    // 戻る先の状態を取得（pop後の最後の履歴、もしくは初期データ）
    const targetState = newPast.length > 0
      ? newPast[newPast.length - 1]
      : originalData;

    set({
      flowData: structuredClone(targetState || currentState),
      history: {
        past: newPast,
        future: [currentState, ...history.future],
      },
    });
  },

  redo: () => {
    const { history, flowData } = get();

    if (history.future.length === 0 || !flowData) {
      return;
    }

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      flowData: structuredClone(next),
      history: {
        past: [...history.past, flowData],
        future: newFuture,
      },
    });
  },

  clearHistory: () => {
    set({ history: { past: [], future: [] } });
  },

  cancelEdit: () => {
    const { originalData } = get();
    if (originalData) {
      set({
        flowData: structuredClone(originalData),
        isEditMode: false,
        history: { past: [], future: [] },
        originalData: null,
      });
    }
  },

  loadFlowFromFile: async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      const filePromise = new Promise<File | null>((resolve) => {
        window.addEventListener('focus', () => {
          setTimeout(() => {
            if (!input.files?.length) {
              resolve(null);
            }
          }, 300);
        }, { once: true });

        input.onchange = (e) => {
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
      const adjustedData = {
        ...data,
        organization: adjustOrganizationData(data.organization)
      };
      set({ flowData: adjustedData, currentRow: 0 });
    } catch (error) {
      useErrorStore.getState().showError(error instanceof Error ? error : new Error('ファイルの読み込み中にエラーが発生しました'));
      throw error;
    }
  },

  updateAction: (index: number, updates: Partial<Action>) => {
    try {
      const currentData = get().flowData;
      if (!currentData) return;

      const newFlow = [...currentData.flow];
      newFlow[index] = {
        ...newFlow[index],
        ...updates,
      };

      set({
        flowData: {
          ...currentData,
          flow: newFlow,
        },
      });
    } catch (error) {
      useErrorStore.getState().showError(error instanceof Error ? error : new Error('アクションの更新中にエラーが発生しました'));
    }
  }
}))

export default useFlowStore