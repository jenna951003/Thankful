'use client'

import { useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = '검색...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`relative transition-all duration-200 ${
      isFocused ? 'scale-[1.02]' : ''
    }`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border-0 text-gray-800 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white ${
            isFocused ? 'bg-white' : ''
          }`}
        />
        
        {/* Search Icon */}
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
          isFocused ? 'text-blue-500' : 'text-gray-400'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}