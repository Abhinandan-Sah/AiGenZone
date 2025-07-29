"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Code, Palette, Download, Sparkles, Rocket, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div initial="initial" animate="animate" variants={staggerChildren} className="text-center mb-20">
          <motion.div variants={fadeInUp} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Gemini AI
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            AiGenZone
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            The ultimate AI-powered micro-frontend playground. Generate, preview, and export React components with
            natural language conversations.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-hover"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 btn-hover bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {[
            {
              icon: Zap,
              title: "AI-Powered",
              description: "Generate components using natural language with Gemini 2.0 Flash",
              color: "text-yellow-400",
            },
            {
              icon: Code,
              title: "Live Preview",
              description: "See your components come to life with real-time preview and editing",
              color: "text-green-400",
            },
            {
              icon: Palette,
              title: "Customizable",
              description: "Iterate and refine your components with multi-turn conversations",
              color: "text-purple-400",
            },
            {
              icon: Download,
              title: "Export Ready",
              description: "Download your components as ZIP files ready for production use",
              color: "text-blue-400",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 btn-hover">
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div initial="initial" animate="animate" variants={staggerChildren} className="text-center mb-20">
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white mb-12">
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Describe",
                description: "Tell our AI what component you want to create using natural language",
                color: "bg-blue-500",
              },
              {
                step: "2",
                title: "Generate",
                description: "Watch as your component is generated and previewed live with TypeScript and Tailwind",
                color: "bg-purple-500",
              },
              {
                step: "3",
                title: "Export",
                description: "Download your component as a complete ZIP package ready for production",
                color: "bg-green-500",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className={`${item.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {[
            { icon: Shield, label: "Secure & Private", value: "100%" },
            { icon: Zap, label: "Generation Speed", value: "<2s" },
            { icon: Globe, label: "Framework Support", value: "React+" },
          ].map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="bg-gray-800/30 border-gray-700 text-center backdrop-blur-sm">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Build the Future?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of developers who are already using AiGenZone to create amazing React components with the
                power of AI.
              </p>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-hover"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
