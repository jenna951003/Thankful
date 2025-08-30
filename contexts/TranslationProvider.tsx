import { TranslationProvider as ClientProvider } from './TranslationContext'

interface TranslationProviderProps {
  children: React.ReactNode
  locale: string
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  locale
}) => {
  return (
    <ClientProvider locale={locale}>
      {children}
    </ClientProvider>
  )
}