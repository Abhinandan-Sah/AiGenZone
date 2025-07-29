import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user sessions
    const { data: sessions, error } = await supabase
      .from("sessions")
      .select(`
        *,
        components (*)
      `)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Sessions API error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        name: name || "New Session",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Create session API error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
