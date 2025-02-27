import { describe, it, expect, beforeEach } from 'vitest';
import useOrganizationUtils, { adjustOrganizationData } from './organizationUtils';
import organizationSettings from '@/content/settings/organization.json';
import type { Flow, Member, Weapon, Summon, Ability } from '@/types/models';

describe('OrganizationUtils', () => {
  // 基本的なテスト用の組織データを作成
  const createEmptyOrganization = (): Flow['organization'] => ({
    job: {
      name: '',
      note: '',
      equipment: { name: '', note: '' },
      abilities: [],
    },
    member: {
      front: [],
      back: [],
    },
    weapon: {
      main: { name: '', note: '', additionalSkill: '' },
      other: [],
      additional: [],
    },
    weaponEffects: {
      taRate: '',
      hp: '',
      defense: '',
    },
    summon: {
      main: { name: '', note: '' },
      friend: { name: '', note: '' },
      other: [],
      sub: [],
    },
    totalEffects: {
      taRate: '',
      hp: '',
      defense: '',
    },
  });

  describe('adjustOrganizationData', () => {
    it('空の組織データを設定に合わせた長さに調整すべき', () => {
      // 空の組織データを準備
      const emptyOrg = createEmptyOrganization();

      // 調整を実行
      const adjusted = adjustOrganizationData(emptyOrg);

      // 結果を検証
      expect(adjusted.job.abilities.length).toBe(organizationSettings.job.abilities);
      expect(adjusted.member.front.length).toBe(organizationSettings.member.front);
      expect(adjusted.member.back.length).toBe(organizationSettings.member.back);
      expect(adjusted.weapon.other.length).toBe(organizationSettings.weapon.other);
      expect(adjusted.weapon.additional.length).toBe(organizationSettings.weapon.additional);
      expect(adjusted.summon.other.length).toBe(organizationSettings.summon.other);
      expect(adjusted.summon.sub.length).toBe(organizationSettings.summon.sub);
    });

    it('既に存在するデータは保持されるべき', () => {
      // サンプルデータを用意
      const sampleOrg = createEmptyOrganization();

      // 一部のデータを設定
      const ability: Ability = { name: 'テスト能力', note: 'テストノート' };
      const member: Member = {
        name: 'テストメンバー',
        note: 'テストノート',
        awaketype: 'テスト覚醒',
        accessories: 'テストアクセサリー',
        limitBonus: 'テスト上限解放'
      };
      const weapon: Weapon = {
        name: 'テスト武器',
        note: 'テストノート',
        additionalSkill: 'テスト追加スキル'
      };
      const summon: Summon = { name: 'テスト召喚石', note: 'テストノート' };

      sampleOrg.job.abilities = [ability];
      sampleOrg.member.front = [member];
      sampleOrg.weapon.other = [weapon];
      sampleOrg.summon.other = [summon];

      // 調整を実行
      const adjusted = adjustOrganizationData(sampleOrg);

      // 元のデータが保持されているか検証
      expect(adjusted.job.abilities[0]).toEqual(ability);
      expect(adjusted.member.front[0]).toEqual(member);
      expect(adjusted.weapon.other[0]).toEqual(weapon);
      expect(adjusted.summon.other[0]).toEqual(summon);

      // 長さが設定値に合わせて調整されたか検証
      expect(adjusted.job.abilities.length).toBe(organizationSettings.job.abilities);
      expect(adjusted.member.front.length).toBe(organizationSettings.member.front);
      expect(adjusted.weapon.other.length).toBe(organizationSettings.weapon.other);
      expect(adjusted.summon.other.length).toBe(organizationSettings.summon.other);
    });

    it('設定値より多いデータは削除されないべき', () => {
      // サンプルデータを用意
      const sampleOrg = createEmptyOrganization();

      // 設定値より多いデータを設定
      const extraAbilities = Array(organizationSettings.job.abilities + 2)
        .fill(null)
        .map((_, i) => ({ name: `能力${i}`, note: `ノート${i}` }));

      sampleOrg.job.abilities = extraAbilities;

      // 調整を実行
      const adjusted = adjustOrganizationData(sampleOrg);

      // 長さが保持されているか検証（削除されていないか）
      expect(adjusted.job.abilities.length).toBe(extraAbilities.length);

      // 元のデータが保持されているか検証
      extraAbilities.forEach((ability, i) => {
        expect(adjusted.job.abilities[i]).toEqual(ability);
      });
    });
  });

  describe('useOrganizationUtils store', () => {
    it('ストアからadjustOrganizationDataメソッドを取得できるべき', () => {
      const store = useOrganizationUtils.getState();
      expect(store.adjustOrganizationData).toBeDefined();
      expect(typeof store.adjustOrganizationData).toBe('function');
    });

    it('ストアのadjustOrganizationDataはエクスポートされた関数と同じ動作をするべき', () => {
      const sampleOrg = createEmptyOrganization();
      const storeResult = useOrganizationUtils.getState().adjustOrganizationData(sampleOrg);
      const directResult = adjustOrganizationData(sampleOrg);

      expect(storeResult).toEqual(directResult);
    });
  });
});