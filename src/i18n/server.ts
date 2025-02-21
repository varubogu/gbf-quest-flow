import initI18n from './index'

let i18nInstance: Awaited<ReturnType<typeof initI18n>> | null = null

export const getServerSideI18n = async () => {
  if (!i18nInstance) {
    i18nInstance = await initI18n()
  }
  return i18nInstance
}

export const getDefaultTitle = () => 'GBF Quest Flow'
export const getDefaultDescription = () => 'A tool to manage and share quest flows for Granblue Fantasy'