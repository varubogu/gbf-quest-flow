import initI18n from '@/i18n'

let i18nInstance: Awaited<ReturnType<typeof initI18n>> | null = null

export const getI18n = async () => {
  if (!i18nInstance) {
    i18nInstance = await initI18n()
  }
  return i18nInstance
}

export const getT = async () => {
  const i18n = await getI18n()
  return (key: string, options?: any) => i18n.t(key, options)
}

export const getCurrentLang = async () => {
  const i18n = await getI18n()
  return i18n.language
}