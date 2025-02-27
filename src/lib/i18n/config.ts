import type { InitOptions } from 'i18next'

export const i18nConfig: InitOptions = {
  fallbackLng: 'ja',
  ns: ['common', 'weapon', 'character', 'summon'],
  defaultNS: 'common',
  // @ts-ignore: i18nの型定義の問題を一時的に抑制
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage', 'navigator']
  }
}