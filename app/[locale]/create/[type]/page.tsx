import CanvasEditor from '../../../../components/canvas/CanvasEditor'

interface CreateNotePageProps {
  params: Promise<{ locale: string; type: 'gratitude' | 'sermon' | 'prayer' }>
}

export default async function CreateNotePage({ params }: CreateNotePageProps) {
  const { locale, type } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Safe Zone Top */}
      <div style={{ height: 'var(--actual-safe-top)' }} />
      
      <CanvasEditor locale={locale} noteType={type} />
    </div>
  )
}