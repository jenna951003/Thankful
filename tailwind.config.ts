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
      const foreignLocales = '[data-locale="en"], [data-locale="es"], [data-locale="pt"]'
      
      const utilities: Record<string, any> = {}
      
      // 텍스트 크기 유틸리티
      const textSizes = {
        'xs': { 'font-size': '0.75rem', 'line-height': '1rem' },
        'sm': { 'font-size': '0.875rem', 'line-height': '1.25rem' },
        'base': { 'font-size': '1rem', 'line-height': '1.5rem' },
        'lg': { 'font-size': '1.125rem', 'line-height': '1.75rem' },
        'xl': { 'font-size': '1.25rem', 'line-height': '1.75rem' },
        '2xl': { 'font-size': '1.5rem', 'line-height': '2rem' },
        '3xl': { 'font-size': '1.875rem', 'line-height': '2.25rem' },
        '4xl': { 'font-size': '2.25rem', 'line-height': '2.5rem' },
        '5xl': { 'font-size': '3rem', 'line-height': '1' },
        '6xl': { 'font-size': '3.75rem', 'line-height': '1' }
      }
      
      // 폰트 굵기 유틸리티
      const fontWeights = {
        'thin': { 'font-weight': '100' },
        'extralight': { 'font-weight': '200' },
        'light': { 'font-weight': '300' },
        'normal': { 'font-weight': '400' },
        'medium': { 'font-weight': '500' },
        'semibold': { 'font-weight': '600' },
        'bold': { 'font-weight': '700' },
        'extrabold': { 'font-weight': '800' },
        'black': { 'font-weight': '900' }
      }
      
      // 패딩 유틸리티
      const paddings = {
        '0': { 'padding': '0' },
        '1': { 'padding': '0.25rem' },
        '2': { 'padding': '0.5rem' },
        '3': { 'padding': '0.75rem' },
        '4': { 'padding': '1rem' },
        '5': { 'padding': '1.25rem' },
        '6': { 'padding': '1.5rem' },
        '8': { 'padding': '2rem' },
        '10': { 'padding': '2.5rem' },
        '12': { 'padding': '3rem' }
      }
      
      // 마진 유틸리티
      const margins = {
        '0': { 'margin': '0' },
        '1': { 'margin': '0.25rem' },
        '2': { 'margin': '0.5rem' },
        '3': { 'margin': '0.75rem' },
        '4': { 'margin': '1rem' },
        '5': { 'margin': '1.25rem' },
        '6': { 'margin': '1.5rem' },
        '8': { 'margin': '2rem' },
        '10': { 'margin': '2.5rem' },
        '12': { 'margin': '3rem' }
      }
      
      // 기본 유틸리티 생성
      Object.entries(textSizes).forEach(([size, styles]) => {
        utilities[`${foreignLocales} .fo\\:text-${size}`] = {
          ...styles,
          '!important': true
        }
      })
      
      Object.entries(fontWeights).forEach(([weight, styles]) => {
        utilities[`${foreignLocales} .fo\\:font-${weight}`] = {
          ...styles,
          '!important': true
        }
      })
      
      Object.entries(paddings).forEach(([size, styles]) => {
        utilities[`${foreignLocales} .fo\\:p-${size}`] = {
          ...styles,
          '!important': true
        }
        utilities[`${foreignLocales} .fo\\:px-${size}`] = {
          'padding-left': styles.padding,
          'padding-right': styles.padding,
          '!important': true
        }
        utilities[`${foreignLocales} .fo\\:py-${size}`] = {
          'padding-top': styles.padding,
          'padding-bottom': styles.padding,
          '!important': true
        }
      })
      
      Object.entries(margins).forEach(([size, styles]) => {
        utilities[`${foreignLocales} .fo\\:m-${size}`] = {
          ...styles,
          '!important': true
        }
        utilities[`${foreignLocales} .fo\\:mx-${size}`] = {
          'margin-left': styles.margin,
          'margin-right': styles.margin,
          '!important': true
        }
        utilities[`${foreignLocales} .fo\\:my-${size}`] = {
          'margin-top': styles.margin,
          'margin-bottom': styles.margin,
          '!important': true
        }
      })
      
      // 반응형 버전 생성 (sm, md, lg, xl)
      const breakpoints = {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px'
      }
      
      Object.entries(breakpoints).forEach(([bp, minWidth]) => {
        const mediaQuery: Record<string, any> = {}
        
        // 텍스트 크기
        Object.entries(textSizes).forEach(([size, styles]) => {
          mediaQuery[`${foreignLocales} .fo\\:${bp}\\:text-${size}`] = {
            ...styles,
            '!important': true
          }
        })
        
        // 폰트 굵기
        Object.entries(fontWeights).forEach(([weight, styles]) => {
          mediaQuery[`${foreignLocales} .fo\\:${bp}\\:font-${weight}`] = {
            ...styles,
            '!important': true
          }
        })
        
        // 패딩
        Object.entries(paddings).forEach(([size, styles]) => {
          mediaQuery[`${foreignLocales} .fo\\:${bp}\\:p-${size}`] = {
            ...styles,
            '!important': true
          }
          mediaQuery[`${foreignLocales} .fo\\:${bp}\\:px-${size}`] = {
            'padding-left': styles.padding,
            'padding-right': styles.padding,
            '!important': true
          }
          mediaQuery[`${foreignLocales} .fo\\:${bp}\\:py-${size}`] = {
            'padding-top': styles.padding,
            'padding-bottom': styles.padding,
            '!important': true
          }
        })
        
        // 마진
        Object.entries(margins).forEach(([size, styles]) => {
          mediaQuery[`${foreignLocales} .fo\\:${bp}\\:m-${size}`] = {
            ...styles,
            '!important': true
          }
          mediaQuery[`${foreignLocales} .fo\\:${bp}\\:mx-${size}`] = {
            'margin-left': styles.margin,
            'margin-right': styles.margin,
            '!important': true
          }
          mediaQuery[`${foreignLocales} .fo\\:${bp}\\:my-${size}`] = {
            'margin-top': styles.margin,
            'margin-bottom': styles.margin,
            '!important': true
          }
        })
        
        utilities[`@media (min-width: ${minWidth})`] = mediaQuery
      })
      
      addUtilities(utilities)
    }
  ],
}
export default config