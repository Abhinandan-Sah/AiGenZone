import { NextRequest, NextResponse } from "next/server"

// This API route blocks unwanted tracking requests
export async function GET(request: NextRequest) {
  // Return empty response to block tracking
  return new NextResponse(null, { 
    status: 204,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}

export async function POST(request: NextRequest) {
  return new NextResponse(null, { 
    status: 204,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}
