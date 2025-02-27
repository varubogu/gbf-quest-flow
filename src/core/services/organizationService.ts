import type { Flow, Member, Summon, Weapon, Ability } from '@/types/models';
import organizationSettings from '@/content/settings/organization.json';

/**
 * データの個数を設定に合わせて調整する関数（不足分のみ追加）
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
 */
export const adjustOrganizationData = (organization: Flow['organization']): Flow['organization'] => {
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