import BottomTabs from '../../../components/navigation/BottomTabs'
import SettingsContent from '../../../components/settings/SettingsContent'

interface SettingsPageProps {
  params: Promise<{ locale: string }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Safe Zone Top */}
      <div style={{ height: 'var(--actual-safe-top)' }} />
      
      {/* Main Content */}
      <SettingsContent locale={locale} />
      
      {/* Bottom Navigation */}
      <BottomTabs locale={locale} />
    </div>
  )
}