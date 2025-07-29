import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Return 404 for any unmatched API routes to reduce console noise
  return NextResponse.json({ error: "Not Found" }, { status: 404 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Not Found" }, { status: 404 })
}
