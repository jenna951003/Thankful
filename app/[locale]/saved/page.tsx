import BottomTabs from '../../../components/navigation/BottomTabs'
import SavedNotesContent from '../../../components/saved/SavedNotesContent'

interface SavedNotesPageProps {
  params: Promise<{ locale: string }>
}

export default async function SavedNotesPage({ params }: SavedNotesPageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Safe Zone Top */}
      <div style={{ height: 'var(--actual-safe-top)' }} />
      
      {/* Main Content */}
      <SavedNotesContent locale={locale} />
      
      {/* Bottom Navigation */}
      <BottomTabs locale={locale} />
    </div>
  )
}