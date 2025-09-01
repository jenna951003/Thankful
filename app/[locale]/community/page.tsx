import BottomTabs from '../../../components/navigation/BottomTabs'
import CommunityContent from '../../../components/community/CommunityContent'

interface CommunityPageProps {
  params: Promise<{ locale: string }>
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Safe Zone Top */}
      <div style={{ height: 'var(--actual-safe-top)' }} />
      
      {/* Main Content */}
      <CommunityContent locale={locale} />
      
      {/* Bottom Navigation */}
      <BottomTabs locale={locale} />
    </div>
  )
}