'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fabric } from 'fabric'
import CanvasToolbar from './CanvasToolbar'
import CanvasTemplates from './CanvasTemplates'

interface CanvasEditorProps {
  locale: string
  noteType: 'gratitude' | 'sermon' | 'prayer'
}

export default function CanvasEditor({ locale, noteType }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const router = useRouter()
  const [showTemplates, setShowTemplates] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const noteTypeConfig = {
    gratitude: {
      title: '감사 노트',
      subtitle: '감사한 마음을 시각적으로 표현해보세요',
      icon: '🙏',
      color: 'from-green-400 to-emerald-500',
      placeholderText: '오늘 감사한 일을 적어보세요...'
    },
    sermon: {
      title: '설교 노트',
      subtitle: '말씀을 창의적으로 정리해보세요',
      icon: '📖',
      color: 'from-orange-400 to-red-500',
      placeholderText: '말씀의 핵심을 적어보세요...'
    },
    prayer: {
      title: '기도 노트',
      subtitle: '기도제목과 응답을 기록해보세요',
      icon: '🕊️',
      color: 'from-teal-400 to-cyan-500',
      placeholderText: '기도제목을 적어보세요...'
    }
  }

  const config = noteTypeConfig[noteType]

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialize Fabric.js canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth - 32,
        height: window.innerHeight - 200,
        backgroundColor: '#fefefe',
        selection: true,
        preserveObjectStacking: true
      })

      fabricCanvasRef.current = canvas

      // Add default text
      const defaultText = new fabric.IText(config.placeholderText, {
        left: 50,
        top: 100,
        fontFamily: 'Jua, sans-serif',
        fontSize: 18,
        fill: '#374151',
        width: 300
      })

      canvas.add(defaultText)
      canvas.setActiveObject(defaultText)

      // Cleanup
      return () => {
        canvas.dispose()
        fabricCanvasRef.current = null
      }
    }
  }, [])

  const handleAddText = () => {
    if (!fabricCanvasRef.current) return

    const text = new fabric.IText('새로운 텍스트를 입력하세요', {
      left: Math.random() * 200 + 50,
      top: Math.random() * 200 + 50,
      fontFamily: 'Jua, sans-serif',
      fontSize: 16,
      fill: '#374151'
    })

    fabricCanvasRef.current.add(text)
    fabricCanvasRef.current.setActiveObject(text)
  }

  const handleAddShape = (shape: 'circle' | 'rectangle' | 'triangle') => {
    if (!fabricCanvasRef.current) return

    let shapeObject

    switch (shape) {
      case 'circle':
        shapeObject = new fabric.Circle({
          radius: 50,
          fill: '#f59e0b',
          left: Math.random() * 200 + 50,
          top: Math.random() * 200 + 50
        })
        break
      case 'rectangle':
        shapeObject = new fabric.Rect({
          width: 100,
          height: 60,
          fill: '#10b981',
          left: Math.random() * 200 + 50,
          top: Math.random() * 200 + 50
        })
        break
      case 'triangle':
        shapeObject = new fabric.Triangle({
          width: 80,
          height: 80,
          fill: '#6366f1',
          left: Math.random() * 200 + 50,
          top: Math.random() * 200 + 50
        })
        break
    }

    fabricCanvasRef.current.add(shapeObject)
    fabricCanvasRef.current.setActiveObject(shapeObject)
  }

  const handleColorChange = (color: string) => {
    const activeObject = fabricCanvasRef.current?.getActiveObject()
    if (activeObject) {
      if (activeObject.type === 'i-text') {
        activeObject.set('fill', color)
      } else {
        activeObject.set('fill', color)
      }
      fabricCanvasRef.current?.renderAll()
    }
  }

  const handleSave = async () => {
    if (!fabricCanvasRef.current) return

    setIsLoading(true)
    
    try {
      // Export canvas as data URL
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1.0
      })

      // Mock save to database (Supabase integration will be added later)
      const noteData = {
        type: noteType,
        canvasData: JSON.stringify(fabricCanvasRef.current.toJSON()),
        imageUrl: dataURL,
        createdAt: new Date().toISOString()
      }

      console.log('Saving note:', noteData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      router.push(`/${locale}/home`)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} px-6 py-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold font-jua flex items-center gap-2">
                {config.icon} {config.title}
              </h1>
              <p className="text-sm opacity-90 font-hubballi">
                {config.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
            >
              템플릿
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-1.5 bg-white text-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장하기'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <CanvasToolbar
        onAddText={handleAddText}
        onAddShape={handleAddShape}
        onColorChange={handleColorChange}
        canvas={fabricCanvasRef.current}
      />

      {/* Canvas Area */}
      <div className="flex-1 p-4 bg-gray-50 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
          <canvas
            ref={canvasRef}
            className="border-none"
          />
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <CanvasTemplates
          noteType={noteType}
          onClose={() => setShowTemplates(false)}
          onApplyTemplate={(template) => {
            // Apply template to canvas
            if (fabricCanvasRef.current) {
              fabricCanvasRef.current.loadFromJSON(template.canvasData, () => {
                fabricCanvasRef.current?.renderAll()
              })
            }
            setShowTemplates(false)
          }}
        />
      )}

      {/* Safe Zone Bottom */}
      <div style={{ height: 'var(--actual-safe-bottom)' }} className="bg-gray-50" />
    </div>
  )
}