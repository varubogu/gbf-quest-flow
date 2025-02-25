import initI18n from '@/i18n'
import type { i18n, TOptions } from 'i18next'

let i18nInstance: i18n | null = null

export const getI18n = async (): Promise<i18n> => {
  if (!i18nInstance) {
    // @ts-ignore: i18nの型定義の問題を一時的に抑制
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    i18nInstance = await initI18n()
  }
  if (!i18nInstance) {
    throw new Error('Failed to initialize i18n')
  }
  return i18nInstance
}

export const getT = async (): Promise<((_key: string, _options?: TOptions) => string)> => {
  const i18n = await getI18n()
  // @ts-ignore: i18nの型定義の問題を一時的に抑制
  return (key: string, options?: TOptions) => i18n.t(key, options)
}

export const getCurrentLang = async (): Promise<string> => {
  const i18n = await getI18n()
  return i18n.language
}