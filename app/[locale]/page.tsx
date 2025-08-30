import LocaleMainPage from '../../components/LocaleMainPage'

interface LocalePageProps {
  params: Promise<{ locale: string }>
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params

  return <LocaleMainPage locale={locale} />
}