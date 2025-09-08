import HomePage from '../../components/home/HomePage'

interface LocalePageProps {
  params: Promise<{ locale: string }>
}

// 🎯 각 언어별 홈페이지 - 직접 HomePage 렌더링 (구조 단순화)
export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params
  
  console.log(`🎯 ${locale.toUpperCase()} HomePage: Direct rendering (no intermediate layers)`)
  return <HomePage locale={locale} />
}