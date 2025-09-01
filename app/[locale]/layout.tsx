import { TranslationProvider } from '../../contexts/TranslationProvider'
import { AuthProvider } from '../../contexts/AuthProvider'

export async function generateStaticParams() {
  return [
    { locale: 'ko' },
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'pt' }
  ]
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ 
  children, 
  params 
}: LocaleLayoutProps) {
  const { locale } = await params

  return (
    <AuthProvider>
      <TranslationProvider locale={locale}>
        <div className="locale-wrapper">
          {children}
        </div>
      </TranslationProvider>
    </AuthProvider>
  )
}