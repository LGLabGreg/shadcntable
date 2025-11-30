'use client'

import { createContext, useContext } from 'react'

import { defaultDataTableLocale } from '../config/locale'
import { type DataTableLocale } from '../types/locale'

interface DataTableLocaleContextValue {
  locale: DataTableLocale
}

const DataTableLocaleContext = createContext<DataTableLocaleContextValue | null>(null)

interface DataTableLocaleProviderProps {
  children: React.ReactNode
  locale: DataTableLocale
}

export function DataTableLocaleProvider({
  children,
  locale,
}: DataTableLocaleProviderProps) {
  return (
    <DataTableLocaleContext.Provider value={{ locale }}>
      {children}
    </DataTableLocaleContext.Provider>
  )
}

export function useDataTableLocale(): DataTableLocale {
  const context = useContext(DataTableLocaleContext)
  if (!context) {
    return defaultDataTableLocale
  }
  return context.locale
}
