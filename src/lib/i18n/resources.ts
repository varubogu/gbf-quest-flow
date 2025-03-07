import commonJa from './locales/ja/common.json';
import weaponJa from './locales/ja/weapon.json';
import characterJa from './locales/ja/character.json';
import summonJa from './locales/ja/summon.json';
import skillJa from './locales/ja/skill.json';
import awakeJa from './locales/ja/awake.json';
import jobsJa from './locales/ja/jobs.json';
import abilityJa from './locales/ja/ability.json';
import questJa from './locales/ja/quest.json';
import skillNamesJa from './locales/ja/skillNames.json';

import commonEn from './locales/en/common.json';
import weaponEn from './locales/en/weapon.json';
import characterEn from './locales/en/character.json';
import summonEn from './locales/en/summon.json';
import skillEn from './locales/en/skill.json';
import awakeEn from './locales/en/awake.json';
import jobsEn from './locales/en/jobs.json';
import abilityEn from './locales/en/ability.json';
import questEn from './locales/en/quest.json';
import skillNamesEn from './locales/en/skillNames.json';

export const resources = {
  ja: {
    common: commonJa,
    weapon: weaponJa,
    character: characterJa,
    summon: summonJa,
    skill: skillJa,
    awake: awakeJa,
    jobs: jobsJa,
    ability: abilityJa,
    quest: questJa,
    skillNames: skillNamesJa,
  },
  en: {
    common: commonEn,
    weapon: weaponEn,
    character: characterEn,
    summon: summonEn,
    skill: skillEn,
    awake: awakeEn,
    jobs: jobsEn,
    ability: abilityEn,
    quest: questEn,
    skillNames: skillNamesEn,
  },
} as const;