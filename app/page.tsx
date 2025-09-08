import HomePage from '../components/home/HomePage'

// 🎯 영어 기본 홈페이지 - 직접 HomePage 렌더링 (깔끔한 구조)
export default function RootPage() {
  console.log('🎯 English HomePage: Direct rendering (no intermediate layers)')
  return <HomePage locale="en" />
}