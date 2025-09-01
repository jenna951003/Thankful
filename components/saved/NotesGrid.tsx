'use client'

interface Note {
  id: string
  type: 'gratitude' | 'sermon' | 'prayer'
  title: string
  preview: string
  content: string
  imageUrl?: string
  tags: string[]
  createdAt: Date
  isFavorite: boolean
}

type ViewMode = 'grid' | 'list' | 'timeline'

interface NotesGridProps {
  notes: Note[]
  viewMode: ViewMode
  onToggleFavorite: (noteId: string) => void
  locale: string
}

export default function NotesGrid({ notes, viewMode, onToggleFavorite, locale }: NotesGridProps) {
  const getNoteTypeConfig = (type: Note['type']) => {
    const configs = {
      gratitude: {
        icon: '🙏',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        label: '감사'
      },
      sermon: {
        icon: '📖',
        color: 'from-orange-400 to-red-500',
        bgColor: 'from-orange-50 to-red-50',
        label: '설교'
      },
      prayer: {
        icon: '🕊️',
        color: 'from-teal-400 to-cyan-500',
        bgColor: 'from-teal-50 to-cyan-50',
        label: '기도'
      }
    }
    return configs[type]
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      if (diffInHours < 1) return '방금 전'
      return `${diffInHours}시간 전`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}일 전`
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleNoteClick = (note: Note) => {
    // Navigate to note detail
    console.log('Opening note:', note)
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {notes.map((note) => {
          const config = getNoteTypeConfig(note.type)
          return (
            <button
              key={note.id}
              onClick={() => handleNoteClick(note)}
              className={`w-full text-left bg-gradient-to-r ${config.bgColor} rounded-2xl p-4 border border-white/30 hover:shadow-md transition-all duration-200 group`}
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center text-lg flex-shrink-0`}>
                  {config.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold font-jua text-gray-800 text-sm truncate">
                        {note.title}
                      </h3>
                      <span className="text-xs bg-white/70 text-gray-600 px-2 py-1 rounded-full">
                        {config.label}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(note.id)
                      }}
                      className={`text-lg transition-colors ${
                        note.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                      }`}
                    >
                      {note.isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  
                  {/* Content Preview */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 font-hubballi">
                    {note.preview}
                  </p>
                  
                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-white/70 text-gray-600 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(note.createdAt)}</span>
                    <div className="group-hover:text-gray-700 transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  if (viewMode === 'timeline') {
    const groupedByDate = notes.reduce((acc, note) => {
      const dateKey = note.createdAt.toDateString()
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(note)
      return acc
    }, {} as Record<string, Note[]>)

    return (
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([dateKey, dateNotes]) => (
          <div key={dateKey} className="relative">
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {new Date(dateKey).toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
            </div>
            
            {/* Notes for this date */}
            <div className="space-y-3 pl-4">
              {dateNotes.map((note) => {
                const config = getNoteTypeConfig(note.type)
                return (
                  <button
                    key={note.id}
                    onClick={() => handleNoteClick(note)}
                    className={`w-full text-left bg-gradient-to-r ${config.bgColor} rounded-xl p-3 border border-white/30 hover:shadow-md transition-all duration-200 group`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center text-sm`}>
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold font-jua text-gray-800 text-sm">
                          {note.title}
                        </h4>
                        <p className="text-xs text-gray-600 truncate font-hubballi">
                          {note.preview}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleFavorite(note.id)
                        }}
                        className={`text-base transition-colors ${
                          note.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                        }`}
                      >
                        {note.isFavorite ? '⭐' : '☆'}
                      </button>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Grid view (default)
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {notes.map((note) => {
        const config = getNoteTypeConfig(note.type)
        return (
          <button
            key={note.id}
            onClick={() => handleNoteClick(note)}
            className={`text-left bg-gradient-to-br ${config.bgColor} rounded-2xl p-5 border border-white/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center text-lg`}>
                {config.icon}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(note.id)
                }}
                className={`text-xl transition-colors ${
                  note.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                }`}
              >
                {note.isFavorite ? '⭐' : '☆'}
              </button>
            </div>
            
            {/* Content */}
            <div className="mb-4">
              <h3 className="font-bold font-jua text-gray-800 text-base mb-2 line-clamp-2">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 font-hubballi">
                {note.preview}
              </p>
            </div>
            
            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-white/70 text-gray-600 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{note.tags.length - 2}
                  </span>
                )}
              </div>
            )}
            
            {/* Footer */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{formatDate(note.createdAt)}</span>
              <span className="bg-white/70 text-gray-600 px-2 py-1 rounded-full">
                {config.label}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}