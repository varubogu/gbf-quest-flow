import commonJa from './locales/ja/common.json';
import weaponJa from './locales/ja/weapon.json';
import characterJa from './locales/ja/character.json';
import summonJa from './locales/ja/summon.json';
import skillJa from './locales/ja/skill.json';

import commonEn from './locales/en/common.json';
import weaponEn from './locales/en/weapon.json';
import characterEn from './locales/en/character.json';
import summonEn from './locales/en/summon.json';
import skillEn from './locales/en/skill.json';

export const resources = {
  ja: {
    common: commonJa,
    weapon: weaponJa,
    character: characterJa,
    summon: summonJa,
    skill: skillJa,
  },
  en: {
    common: commonEn,
    weapon: weaponEn,
    character: characterEn,
    summon: summonEn,
    skill: skillEn,
  },
} as const;