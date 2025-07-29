#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

// Required environment variables
const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "JWT_SECRET",
]

// Optional but recommended variables
const RECOMMENDED_VARS = ["SUPABASE_SERVICE_ROLE_KEY", "MONGODB_URI", "REDIS_HOST", "NEXT_PUBLIC_APP_URL"]

function checkEnvironmentVariables() {
  console.log("🔍 Checking environment variables...\n")

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), ".env.local")
  if (!fs.existsSync(envPath)) {
    console.log("❌ .env.local file not found!")
    console.log("📝 Please copy .env.local.example to .env.local and fill in your values.\n")
    process.exit(1)
  }

  // Load environment variables
  require("dotenv").config({ path: envPath })

  const missingRequired = []
  const missingRecommended = []

  // Check required variables
  console.log("✅ Required Variables:")
  REQUIRED_VARS.forEach((varName) => {
    const value = process.env[varName]
    if (!value) {
      missingRequired.push(varName)
      console.log(`   ❌ ${varName}: Missing`)
    } else {
      const displayValue = value.length > 20 ? `${value.substring(0, 20)}...` : value
      console.log(`   ✅ ${varName}: ${displayValue}`)
    }
  })

  console.log("\n📋 Recommended Variables:")
  RECOMMENDED_VARS.forEach((varName) => {
    const value = process.env[varName]
    if (!value) {
      missingRecommended.push(varName)
      console.log(`   ⚠️  ${varName}: Missing (optional)`)
    } else {
      const displayValue = value.length > 20 ? `${value.substring(0, 20)}...` : value
      console.log(`   ✅ ${varName}: ${displayValue}`)
    }
  })

  // Summary
  console.log("\n📊 Summary:")
  if (missingRequired.length === 0) {
    console.log("✅ All required environment variables are set!")
  } else {
    console.log(`❌ Missing ${missingRequired.length} required variables:`)
    missingRequired.forEach((varName) => {
      console.log(`   - ${varName}`)
    })
  }

  if (missingRecommended.length > 0) {
    console.log(`⚠️  Missing ${missingRecommended.length} recommended variables:`)
    missingRecommended.forEach((varName) => {
      console.log(`   - ${varName}`)
    })
  }

  // Validation checks
  console.log("\n🔍 Validation Checks:")

  // Check Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl && !supabaseUrl.includes("supabase.co")) {
    console.log("   ⚠️  Supabase URL format might be incorrect")
  } else if (supabaseUrl) {
    console.log("   ✅ Supabase URL format looks correct")
  }

  // Check JWT secret length
  const jwtSecret = process.env.JWT_SECRET
  if (jwtSecret && jwtSecret.length < 32) {
    console.log("   ⚠️  JWT_SECRET should be at least 32 characters long")
  } else if (jwtSecret) {
    console.log("   ✅ JWT_SECRET length is adequate")
  }

  // Check Google AI API key format
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (googleApiKey && !googleApiKey.startsWith("AIza")) {
    console.log("   ⚠️  Google AI API key format might be incorrect")
  } else if (googleApiKey) {
    console.log("   ✅ Google AI API key format looks correct")
  }

  console.log("\n")

  if (missingRequired.length > 0) {
    console.log("❌ Setup incomplete. Please add the missing required variables to .env.local")
    process.exit(1)
  } else {
    console.log("🎉 Environment setup complete! You can now run the application.")
    process.exit(0)
  }
}

// Run the check
checkEnvironmentVariables()
