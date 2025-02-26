import type { Flow, Action, Member, Summon, Weapon, Ability } from '@/types/models';
import type { BaseFlowStore } from '@/types/flowStore.types';
import { create } from 'zustand';
import organizationSettings from '@/content/settings/organization.json';
import useErrorStore from './errorStore';

/**
 * データの個数を設定に合わせて調整する関数（不足分のみ追加）
 * flowStoreから移行
 */
const adjustArrayLength = <T>(array: T[], targetLength: number, createEmpty: () => T): T[] => {
  if (array.length < targetLength) {
    // 不足分を追加
    return [
      ...array,
      ...Array(targetLength - array.length)
        .fill(null)
        .map(createEmpty),
    ];
  }
  // 既存のデータはそのまま保持
  return array;
};

/**
 * 組織データを設定に合わせて調整する関数（既存データは保持）
 * flowStoreから移行
 */
const adjustOrganizationData = (organization: Flow['organization']): Flow['organization'] => {
  const emptyMember = (): Member => ({
    name: '',
    note: '',
    awaketype: '',
    accessories: '',
    limitBonus: '',
  });

  const emptyWeapon = (): Weapon => ({
    name: '',
    note: '',
    additionalSkill: '',
  });

  const emptySummon = (): Summon => ({
    name: '',
    note: '',
  });

  const emptyAbility = (): Ability => ({
    name: '',
    note: '',
  });

  // 設定値と実際のデータ数の大きい方を使用
  const getTargetLength = (current: number, setting: number): number => Math.max(current, setting);

  return {
    ...organization,
    job: {
      ...organization.job,
      abilities: adjustArrayLength(
        organization.job.abilities,
        getTargetLength(organization.job.abilities.length, organizationSettings.job.abilities),
        emptyAbility
      ),
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
      ),
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
        getTargetLength(
          organization.weapon.additional.length,
          organizationSettings.weapon.additional
        ),
        emptyWeapon
      ),
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
      ),
    },
  };
};

/**
 * フロー状態の基本的な読み取り・更新機能を提供するストア
 */
const useBaseFlowStore = create<BaseFlowStore>((set, get) => ({
  // 状態
  flowData: null,
  originalData: null,

  // 読み取り用メソッド
  getFlowData: (): Flow | null => get().flowData,
  getActionById: (index: number): Action | undefined => get().flowData?.flow[index],

  // 更新用メソッド
  setFlowData: (data: Flow | null): void => {
    try {
      if (data === null) {
        set({ flowData: null });
        return;
      }

      const adjustedData = {
        ...data,
        organization: adjustOrganizationData(data.organization),
      };
      set({ flowData: adjustedData });
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('データの設定中にエラーが発生しました')
        );
    }
  },

  updateFlowData: (updates: Partial<Flow>): void => {
    try {
      const currentData = get().flowData;
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

      // 注：履歴への追加は、ファサードから元のflowStoreで行うため、ここでは行わない
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('データの更新中にエラーが発生しました')
        );
    }
  },

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

      set({
        flowData: {
          ...currentData,
          flow: newFlow,
        },
      });

      // 注：履歴への追加は、ファサードから元のflowStoreで行うため、ここでは行わない
    } catch (error) {
      useErrorStore
        .getState()
        .showError(
          error instanceof Error ? error : new Error('アクションの更新中にエラーが発生しました')
        );
    }
  },
}));

// 組織データの調整関数をエクスポートして他のストアからも使用できるようにする
export { adjustOrganizationData };
export default useBaseFlowStore;