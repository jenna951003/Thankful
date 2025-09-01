import BottomTabs from '../../../components/navigation/BottomTabs'
import HomeContent from '../../../components/home/HomeContent'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Safe Zone Top */}
      <div style={{ height: 'var(--actual-safe-top)' }} />
      
      {/* Main Content */}
      <HomeContent locale={locale} />
      
      {/* Bottom Navigation */}
      <BottomTabs locale={locale} />
    </div>
  )
}