import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import jaCommon from './locales/ja/common.json'
import jaWeapon from './locales/ja/weapon.json'
import jaCharacter from './locales/ja/character.json'
import jaSummon from './locales/ja/summon.json'
import jaSkill from './locales/ja/skill.json'
import enCommon from './locales/en/common.json'
import enWeapon from './locales/en/weapon.json'
import enCharacter from './locales/en/character.json'
import enSummon from './locales/en/summon.json'
import enSkill from './locales/en/skill.json'

// i18nextインスタンスを初期化
i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'ja',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ja: {
        translation: {
          ...jaCommon,
          ...jaWeapon,
          ...jaCharacter,
          ...jaSummon,
          ...jaSkill,
        },
      },
      en: {
        translation: {
          ...enCommon,
          ...enWeapon,
          ...enCharacter,
          ...enSummon,
          ...enSkill,
        },
      },
    },
  })

// 初期化済みのi18nextインスタンスをエクスポート
export default i18next