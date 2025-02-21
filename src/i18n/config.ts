import type { InitOptions } from 'i18next'

export const i18nConfig: InitOptions = {
  fallbackLng: 'ja',
  ns: ['common', 'weapon', 'character', 'summon'],
  defaultNS: 'common',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage', 'navigator']
  }
}