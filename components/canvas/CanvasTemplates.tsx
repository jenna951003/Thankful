'use client'

interface Template {
  id: string
  name: string
  preview: string
  canvasData: string
  category: string
}

interface CanvasTemplatesProps {
  noteType: 'gratitude' | 'sermon' | 'prayer'
  onClose: () => void
  onApplyTemplate: (template: Template) => void
}

export default function CanvasTemplates({
  noteType,
  onClose,
  onApplyTemplate
}: CanvasTemplatesProps) {
  const templates: Record<string, Template[]> = {
    gratitude: [
      {
        id: 'gratitude-1',
        name: '감사 카드',
        preview: '🙏',
        canvasData: JSON.stringify({
          objects: [
            {
              type: 'i-text',
              text: '오늘 감사한 일',
              left: 50,
              top: 50,
              fontSize: 24,
              fontFamily: 'Jua',
              fill: '#374151'
            },
            {
              type: 'rect',
              width: 300,
              height: 2,
              left: 50,
              top: 90,
              fill: '#10b981'
            }
          ]
        }),
        category: '기본'
      },
      {
        id: 'gratitude-2',
        name: '감사 목록',
        preview: '📝',
        canvasData: JSON.stringify({
          objects: [
            {
              type: 'i-text',
              text: '감사한 일 목록',
              left: 50,
              top: 30,
              fontSize: 20,
              fontFamily: 'Jua',
              fill: '#374151'
            },
            {
              type: 'i-text',
              text: '1. ',
              left: 50,
              top: 80,
              fontSize: 16,
              fontFamily: 'Hubballi',
              fill: '#10b981'
            },
            {
              type: 'i-text',
              text: '2. ',
              left: 50,
              top: 120,
              fontSize: 16,
              fontFamily: 'Hubballi',
              fill: '#10b981'
            },
            {
              type: 'i-text',
              text: '3. ',
              left: 50,
              top: 160,
              fontSize: 16,
              fontFamily: 'Hubballi',
              fill: '#10b981'
            }
          ]
        }),
        category: '목록'
      }
    ],
    sermon: [
      {
        id: 'sermon-1',
        name: '말씀 노트',
        preview: '📖',
        canvasData: JSON.stringify({
          objects: [
            {
              type: 'i-text',
              text: '오늘의 말씀',
              left: 50,
              top: 30,
              fontSize: 24,
              fontFamily: 'Jua',
              fill: '#ea580c'
            },
            {
              type: 'i-text',
              text: '본문: ',
              left: 50,
              top: 80,
              fontSize: 16,
              fontFamily: 'Noto Serif KR',
              fill: '#374151'
            },
            {
              type: 'i-text',
              text: '핵심 메시지: ',
              left: 50,
              top: 140,
              fontSize: 16,
              fontFamily: 'Noto Serif KR',
              fill: '#374151'
            },
            {
              type: 'i-text',
              text: '적용점: ',
              left: 50,
              top: 200,
              fontSize: 16,
              fontFamily: 'Noto Serif KR',
              fill: '#374151'
            }
          ]
        }),
        category: '기본'
      }
    ],
    prayer: [
      {
        id: 'prayer-1',
        name: '기도 제목',
        preview: '🕊️',
        canvasData: JSON.stringify({
          objects: [
            {
              type: 'i-text',
              text: '기도 제목',
              left: 50,
              top: 30,
              fontSize: 24,
              fontFamily: 'Jua',
              fill: '#0891b2'
            },
            {
              type: 'circle',
              radius: 5,
              left: 50,
              top: 90,
              fill: '#0891b2'
            },
            {
              type: 'i-text',
              text: '기도 제목을 적어보세요',
              left: 70,
              top: 82,
              fontSize: 16,
              fontFamily: 'Hubballi',
              fill: '#374151'
            }
          ]
        }),
        category: '기본'
      }
    ]
  }

  const currentTemplates = templates[noteType] || []
  const categories = [...new Set(currentTemplates.map(t => t.category))]

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-3/4 bg-white rounded-t-3xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-jua text-gray-800">
              템플릿 선택
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1 font-hubballi">
            마음에 드는 템플릿을 선택하여 빠르게 시작해보세요
          </p>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-6">
          {categories.map((category) => (
            <div key={category} className="p-6">
              <h3 className="text-lg font-semibold font-jua text-gray-800 mb-4">
                {category} 템플릿
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {currentTemplates
                  .filter(template => template.category === category)
                  .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => onApplyTemplate(template)}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                    >
                      <div className="text-center mb-3">
                        <div className="text-4xl mb-2">{template.preview}</div>
                        <div className="w-full h-24 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">미리보기</span>
                        </div>
                      </div>
                      <h4 className="font-semibold font-jua text-gray-800 text-sm">
                        {template.name}
                      </h4>
                    </button>
                  ))}
              </div>
            </div>
          ))}

          {currentTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-500 font-hubballi">
                아직 템플릿이 준비되지 않았습니다
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                빈 캔버스로 시작하기
              </button>
            </div>
          )}

          {/* Safe Zone Bottom */}
          <div style={{ height: 'var(--actual-safe-bottom)' }} />
        </div>
      </div>
    </div>
  )
}