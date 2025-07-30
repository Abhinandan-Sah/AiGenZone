"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Code2, Palette, Zap, Github, Twitter } from "lucide-react"
import Link from "next/link"
import { ParticleBackground } from "@/components/particle-background"
import { ThemeToggle } from "@/components/theme-toggle"

const features = [
  {
    icon: Code2,
    title: "AI-Powered Generation",
    description: "Generate React components with advanced AI that understands your requirements",
  },
  {
    icon: Palette,
    title: "Beautiful Design System",
    description: "Built with Tailwind CSS and Shadcn UI for consistent, modern aesthetics",
  },
  {
    icon: Zap,
    title: "Live Preview",
    description: "See your components come to life instantly with our interactive preview",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      <ParticleBackground />

      {/* Header */}
      <header className="relative z-10 border-b border-border/40 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
              AiGenZone
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
            <Button 
              className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white"
              asChild
            >
              <Link href="/auth/signup">
                Sign Up
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://github.com" target="_blank">
                <Github className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://twitter.com" target="_blank">
                <Twitter className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <motion.section
          className="container mx-auto px-4 py-20 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="w-3 h-3 mr-2" />
              AI-Powered Component Generation
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-emerald-600 to-violet-600 bg-clip-text text-transparent leading-tight"
            variants={itemVariants}
          >
            Build Components
            <br />
            <span className="relative">
              with AI Magic
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Transform your ideas into beautiful React components instantly. Our AI understands your vision and creates
            production-ready code with modern design patterns.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" variants={itemVariants}>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
              asChild
            >
              <Link href="/dashboard">
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 hover:bg-muted/50 bg-transparent">
              View Examples
            </Button>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="container mx-auto px-4 py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to build faster</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to accelerate your development workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group h-full border-2 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="container mx-auto px-4 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border-violet-500/20">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to start building?</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of developers who are already using AiGenZone to create amazing components
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
                asChild
              >
                <Link href="/auth/login">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  )
}
