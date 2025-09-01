import type { Metadata } from 'next'
import { 
  Inter,
  Jua,
  Fascinate,
  Sour_Gummy,
  Hubballi,
  Dongle,
  Noto_Serif_KR,
  Nanum_Brush_Script
} from 'next/font/google'
import './globals.css'
import OfflineIndicator from '../components/common/OfflineIndicator'

// Google Fonts 설정
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const jua = Jua({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jua',
  display: 'swap'
})

const fascinate = Fascinate({ 
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-fascinate',
  display: 'swap'
})

const sourGummy = Sour_Gummy({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sour-gummy',
  display: 'swap'
})

const hubballi = Hubballi({ 
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-hubballi',
  display: 'swap'
})

const dongle = Dongle({ 
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-dongle',
  display: 'swap'
})

const notoSerifKR = Noto_Serif_KR({ 
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '900'],
  variable: '--font-noto-serif-kr',
  display: 'swap'
})

const nanumBrushScript = Nanum_Brush_Script({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-nanum-brush-script',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Thankful - 감사 일기',
  description: '감사함을 기록하고 나누는 앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" style={{ backgroundColor: 'rgb(238, 234, 217)' }} data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background-color: rgb(238, 234, 217) !important;
              margin: 0;
              padding: 0;
            }
          `
        }} />
      </head>
      <body 
        className={`
          ${inter.variable} 
          ${jua.variable}
          ${fascinate.variable}
          ${sourGummy.variable}
          ${hubballi.variable}
          ${dongle.variable}
          ${notoSerifKR.variable}
          ${nanumBrushScript.variable}
        `}
        style={{ backgroundColor: 'rgb(238, 234, 217)' }}
      >
        <OfflineIndicator />
        {children}
      </body>
    </html>
  )
}