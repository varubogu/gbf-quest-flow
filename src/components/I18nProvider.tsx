import { useEffect, type JSX, type ReactNode } from 'react'
import initI18n from '@/i18n'

interface Props {
  children: ReactNode
}

export const I18nProvider = ({ children }: Props): JSX.Element => {
  useEffect(() => {
    initI18n()
  }, [])

  return <>{children}</>
}
