'use client'

import { useState } from 'react'
import { fabric } from 'fabric'

interface CanvasToolbarProps {
  onAddText: () => void
  onAddShape: (shape: 'circle' | 'rectangle' | 'triangle') => void
  onColorChange: (color: string) => void
  canvas: fabric.Canvas | null
}

export default function CanvasToolbar({
  onAddText,
  onAddShape,
  onColorChange,
  canvas
}: CanvasToolbarProps) {
  const [selectedTool, setSelectedTool] = useState<string>('select')
  const [showColorPalette, setShowColorPalette] = useState(false)

  const colors = [
    '#374151', // Gray
    '#ef4444', // Red
    '#f59e0b', // Yellow
    '#10b981', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#f97316', // Orange
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16', // Lime
  ]

  const tools = [
    {
      id: 'text',
      icon: '📝',
      label: '텍스트',
      action: onAddText
    },
    {
      id: 'shapes',
      icon: '🔷',
      label: '도형',
      submenu: [
        { id: 'circle', icon: '⭕', label: '원', action: () => onAddShape('circle') },
        { id: 'rectangle', icon: '⬛', label: '사각형', action: () => onAddShape('rectangle') },
        { id: 'triangle', icon: '🔺', label: '삼각형', action: () => onAddShape('triangle') },
      ]
    }
  ]

  const handleUndo = () => {
    // Implement undo functionality
    console.log('Undo action')
  }

  const handleRedo = () => {
    // Implement redo functionality
    console.log('Redo action')
  }

  const handleDelete = () => {
    const activeObject = canvas?.getActiveObject()
    if (activeObject) {
      canvas?.remove(activeObject)
      canvas?.renderAll()
    }
  }

  const handleClear = () => {
    canvas?.clear()
    canvas?.setBackgroundColor('#fefefe', () => {
      canvas?.renderAll()
    })
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Tools */}
        <div className="flex items-center gap-2">
          {tools.map((tool) => (
            <div key={tool.id} className="relative">
              <button
                onClick={tool.action}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedTool === tool.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tool.icon}</span>
                <span className="text-sm font-medium">{tool.label}</span>
              </button>
            </div>
          ))}
          
          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPalette(!showColorPalette)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-gradient-to-r from-red-400 to-blue-400 rounded border"></div>
              <span className="text-sm font-medium">색상</span>
            </button>
            
            {showColorPalette && (
              <div className="absolute top-12 left-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10">
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        onColorChange(color)
                        setShowColorPalette(false)
                      }}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            title="실행 취소"
          >
            ↶
          </button>
          <button
            onClick={handleRedo}
            className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            title="다시 실행"
          >
            ↷
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 transition-colors"
            title="삭제"
          >
            🗑️
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            전체 지우기
          </button>
        </div>
      </div>

      {/* Click outside to close color palette */}
      {showColorPalette && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowColorPalette(false)}
        />
      )}
    </div>
  )
}