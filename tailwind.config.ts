import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      // fo: = foreign (non-Korean) 언어일 때만 적용되는 직접 CSS 규칙들
      addUtilities({
        // 기본 fo:text 클래스들
        '[data-locale="en"] .fo\\:text-base, [data-locale="es"] .fo\\:text-base, [data-locale="pt"] .fo\\:text-base': {
          'font-size': '1rem !important',
          'line-height': '1.5rem !important'
        },
        '[data-locale="en"] .fo\\:text-lg, [data-locale="es"] .fo\\:text-lg, [data-locale="pt"] .fo\\:text-lg': {
          'font-size': '1.125rem !important',
          'line-height': '1.75rem !important'
        },
        '[data-locale="en"] .fo\\:text-xl, [data-locale="es"] .fo\\:text-xl, [data-locale="pt"] .fo\\:text-xl': {
          'font-size': '1.25rem !important',
          'line-height': '1.75rem !important'
        },
        '[data-locale="en"] .fo\\:text-2xl, [data-locale="es"] .fo\\:text-2xl, [data-locale="pt"] .fo\\:text-2xl': {
          'font-size': '1.5rem !important',
          'line-height': '2rem !important'
        },
        '[data-locale="en"] .fo\\:text-3xl, [data-locale="es"] .fo\\:text-3xl, [data-locale="pt"] .fo\\:text-3xl': {
          'font-size': '1.875rem !important',
          'line-height': '2.25rem !important'
        },
        '[data-locale="en"] .fo\\:text-4xl, [data-locale="es"] .fo\\:text-4xl, [data-locale="pt"] .fo\\:text-4xl': {
          'font-size': '2.25rem !important',
          'line-height': '2.5rem !important'
        },
        '[data-locale="en"] .fo\\:text-5xl, [data-locale="es"] .fo\\:text-5xl, [data-locale="pt"] .fo\\:text-5xl': {
          'font-size': '3rem !important',
          'line-height': '1 !important'
        },
        // 반응형 md: 버전들
        '@media (min-width: 768px)': {
          '[data-locale="en"] .fo\\:md\\:text-base, [data-locale="es"] .fo\\:md\\:text-base, [data-locale="pt"] .fo\\:md\\:text-base': {
            'font-size': '1rem !important',
            'line-height': '1.5rem !important'
          },
          '[data-locale="en"] .fo\\:md\\:text-lg, [data-locale="es"] .fo\\:md\\:text-lg, [data-locale="pt"] .fo\\:md\\:text-lg': {
            'font-size': '1.125rem !important',
            'line-height': '1.75rem !important'
          },
          '[data-locale="en"] .fo\\:md\\:text-xl, [data-locale="es"] .fo\\:md\\:text-xl, [data-locale="pt"] .fo\\:md\\:text-xl': {
            'font-size': '1.25rem !important',
            'line-height': '1.75rem !important'
          },
          '[data-locale="en"] .fo\\:md\\:text-2xl, [data-locale="es"] .fo\\:md\\:text-2xl, [data-locale="pt"] .fo\\:md\\:text-2xl': {
            'font-size': '1.5rem !important',
            'line-height': '2rem !important'
          },
          '[data-locale="en"] .fo\\:md\\:text-3xl, [data-locale="es"] .fo\\:md\\:text-3xl, [data-locale="pt"] .fo\\:md\\:text-3xl': {
            'font-size': '1.875rem !important',
            'line-height': '2.25rem !important'
          },
          '[data-locale="en"] .fo\\:md\\:text-4xl, [data-locale="es"] .fo\\:md\\:text-4xl, [data-locale="pt"] .fo\\:md\\:text-4xl': {
            'font-size': '2.25rem !important',
            'line-height': '2.5rem !important'
          },
          '[data-locale="en"] .fo\\:md\\:text-5xl, [data-locale="es"] .fo\\:md\\:text-5xl, [data-locale="pt"] .fo\\:md\\:text-5xl': {
            'font-size': '3rem !important',
            'line-height': '1 !important'
          }
        }
      })
    }
  ],
}
export default config