import { NextRequest, NextResponse } from "next/server"

// This route handles unwanted tracking requests from browser extensions
export async function GET(request: NextRequest) {
  // Log the request for debugging if needed
  console.log("Blocked tracking request:", request.url)
  
  // Return a 204 No Content response to stop the requests
  return new NextResponse(null, { status: 204 })
}

export async function POST(request: NextRequest) {
  console.log("Blocked tracking request:", request.url)
  return new NextResponse(null, { status: 204 })
}
