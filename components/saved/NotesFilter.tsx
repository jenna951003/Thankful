'use client'

type ViewMode = 'grid' | 'list' | 'timeline'
type FilterType = 'all' | 'gratitude' | 'sermon' | 'prayer' | 'favorites'
type SortType = 'newest' | 'oldest' | 'favorites' | 'mostViewed'

interface NotesFilterProps {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortBy: SortType
  onSortChange: (sort: SortType) => void
  getFilterCount: (filter: FilterType) => number
}

export default function NotesFilter({
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  getFilterCount
}: NotesFilterProps) {
  const filters = [
    { id: 'all' as FilterType, label: '전체', icon: '📋' },
    { id: 'gratitude' as FilterType, label: '감사', icon: '🙏' },
    { id: 'sermon' as FilterType, label: '설교', icon: '📖' },
    { id: 'prayer' as FilterType, label: '기도', icon: '🕊️' },
    { id: 'favorites' as FilterType, label: '즐겨찾기', icon: '⭐' }
  ]

  const viewModes = [
    { id: 'grid' as ViewMode, label: '격자', icon: '▦' },
    { id: 'list' as ViewMode, label: '목록', icon: '☰' },
    { id: 'timeline' as ViewMode, label: '타임라인', icon: '📅' }
  ]

  const sortOptions = [
    { id: 'newest' as SortType, label: '최신순' },
    { id: 'oldest' as SortType, label: '오래된 순' },
    { id: 'favorites' as SortType, label: '즐겨찾기 순' }
  ]

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filterOption) => {
          const count = getFilterCount(filterOption.id)
          return (
            <button
              key={filterOption.id}
              onClick={() => onFilterChange(filterOption.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
                filter === filterOption.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'bg-white/90 text-gray-600 hover:bg-white border border-white/50'
              }`}
            >
              <span className="text-sm">{filterOption.icon}</span>
              <span className="text-sm">{filterOption.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === filterOption.id
                  ? 'bg-white/20'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white/90 rounded-xl p-1 border border-white/50">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onViewModeChange(mode.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === mode.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs">{mode.icon}</span>
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="appearance-none bg-white/90 border border-white/50 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-white focus:outline-none focus:border-blue-300 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}