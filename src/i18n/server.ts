import i18next from './index'
import type { i18n } from 'i18next'

let i18nInstance: i18n | null = null

export const getServerSideI18n = async (): Promise<i18n | null> => {
  if (!i18nInstance) {
    i18nInstance = i18next
  }
  return i18nInstance
}

export const getDefaultTitle = (): string => 'GBF Quest Flow'
export const getDefaultDescription = (): string => 'A tool to manage and share quest flows for Granblue Fantasy'