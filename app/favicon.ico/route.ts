import { NextResponse } from 'next/server'

export async function GET() {
  // 빈 favicon 반환 (HomePage 렌더링 없이)
  const emptyFavicon = Buffer.from(
    'AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'base64'
  )

  return new NextResponse(emptyFavicon, {
    status: 200,
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}