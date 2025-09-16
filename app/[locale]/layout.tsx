import { TranslationProvider } from '../../contexts/TranslationContext'
import HtmlLangSetter from '../../components/common/HtmlLangSetter'

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
    <TranslationProvider locale={locale}>
      <HtmlLangSetter locale={locale} />
      <div className="locale-wrapper">
        {children}
      </div>
    </TranslationProvider>
  )
}