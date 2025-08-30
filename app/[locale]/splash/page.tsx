import SplashPageClient from '../../../components/SplashPageClient'

interface SplashPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function SplashPage({ params }: SplashPageProps) {
  const { locale } = await params

  return <SplashPageClient locale={locale} />
}