import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { CommandPalette } from "@/components/command-palette"
import { SettingsDrawer } from "@/components/settings-drawer"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AiGenZone - AI Component Generator",
  description: "Generate React components with AI - The ultimate micro-frontend playground",
  keywords: "AI, React, Components, Generator, TypeScript, Tailwind",
  authors: [{ name: "AiGenZone Team" }],
  openGraph: {
    title: "AiGenZone - AI Component Generator",
    description: "Generate React components with AI",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
            <CommandPalette />
            <SettingsDrawer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
