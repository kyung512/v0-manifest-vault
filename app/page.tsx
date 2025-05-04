"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Sparkles, Moon, ChevronRight, Instagram, Mail, Volume2, Check, ArrowRight } from "lucide-react"
import { GridBackground } from "@/components/grid-background"
import { RebelButton } from "@/components/rebel-button"
import type React from "react"

import { Lock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { submitForm } from "./actions/submit-form"

// TikTok Icon Component
const TikTokIcon = ({ className = "" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className={className}>
      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  )
}

// Audio Player Component
function AudioPlayer({ src, className = "" }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/30 transition-colors"
      >
        {isPlaying ? (
          <span className="w-3 h-3 bg-purple-400 rounded-sm"></span>
        ) : (
          <Volume2 className="w-5 h-5 text-purple-400" />
        )}
      </button>
      <div className="flex-1">
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-0 audio-progress"></div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={src}
        className="hidden"
        onTimeUpdate={(e) => {
          const progress = (e.currentTarget.currentTime / e.currentTarget.duration) * 100
          document.querySelector(".audio-progress").style.width = `${progress}%`
        }}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}

// Contact Dialog Component
function ContactDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-gray-400 hover:text-gray-300 transition-colors">
        Contact Us
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="bg-[#151515] p-6 rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p className="text-gray-300 mb-6">Have questions or need assistance? Reach out to us directly.</p>

            <div className="py-6">
              <div className="flex items-center justify-center gap-3 text-lg">
                <Mail className="h-5 w-5 text-purple-400" />
                <a
                  href="mailto:contact@manifestvault.com"
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  contact@manifestvault.com
                </a>
              </div>
              <p className="text-center text-gray-400 mt-4 text-sm">We typically respond within 24-48 hours.</p>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Progress Steps Component
function ProgressSteps({ currentStep, totalSteps }) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? "bg-amber-500 text-black"
                  : index === currentStep
                    ? "bg-amber-500/80 text-black"
                    : "bg-gray-700 text-gray-400"
              }`}
            >
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`h-1 w-16 mt-4 ${index < currentStep ? "bg-amber-500" : "bg-gray-700"}`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-2 text-gray-400 text-sm">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  )
}

export default function Home() {
  const [formData, setFormData] = useState({
    limitingBeliefs: "",
    consciousStruggles: "",
    specificObjective: "",
    meditationPurpose: "",
    meditationStyle: "",
    voiceGender: "",
    voiceTonality: "",
    customVoice: null as File | null,
    dreamLifeVisualization: "",
    name: "",
    email: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const result = await submitForm(formData)

      if (result.success) {
        setSubmitSuccess(true)
        // Scroll to success message
        document.getElementById("success-message")?.scrollIntoView({ behavior: "smooth" })
      } else {
        setSubmitError(result.error || "Failed to submit form. Please try again.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit(new Event("submit") as any)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, customVoice: e.target.files[0] })
    }
  }

  // Define experts array outside the JSX for reuse
  const experts = [
    {
      name: "Dr. Joe Dispenza",
      role: "Neuroscience & Manifestation",
      image: "/images/joe-dispenza.jpeg",
    },
    {
      name: "Bob Proctor",
      role: "Law of Attraction & Wealth Mindset",
      image: "/images/bob-proctor.jpeg",
    },
    { name: "Bruce Lipton", role: "The Biology of Belief", image: "/images/bruce-lipton.jpeg" },
    { name: "Brian Tracy", role: "Success & Goal Setting", image: "/images/brian-tracy.jpeg" },
    {
      name: "Vishen Lakhiani",
      role: "Mind Hacking & Spiritual Growth",
      image: "/images/vishen-lakhiani.jpeg",
    },
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* Grid Background with particles */}
      <GridBackground />

      {/* Content with relative positioning to appear above the canvas */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto py-6 px-4 rounded-lg mt-4">
          {/* Logo Row with Social Icons for Mobile */}
          <div className="flex justify-between items-center mb-6 md:mb-0">
            <div className="h-10 flex items-center">
              <h1 className="text-amber-500 font-bold text-2xl">ManifestVault</h1>
            </div>

            {/* Social Icons - Visible on mobile and desktop */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/manifest.vault/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@manifest.vault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Mobile Navigation - Hidden on desktop */}
          <nav className="flex md:hidden space-x-6 overflow-x-auto py-2 pr-4 scrollbar-hide">
            <button
              onClick={() => scrollToSection("why-stuck")}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer whitespace-nowrap text-sm"
            >
              Why You're Stuck
            </button>
            <button
              onClick={() => scrollToSection("visualization")}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer whitespace-nowrap text-sm"
            >
              Visualization
            </button>
            <button
              onClick={() => scrollToSection("solution")}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer whitespace-nowrap text-sm"
            >
              Solution
            </button>
            <button
              onClick={() => scrollToSection("order-form")}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer whitespace-nowrap text-sm"
            >
              Get Started
            </button>
          </nav>

          {/* Desktop Navigation - Hidden on mobile, centered */}
          <nav className="hidden md:flex md:justify-center space-x-8 py-0 w-full">
            <button
              onClick={() => scrollToSection("why-stuck")}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
            >
              Why You're Stuck
            </button>
            <button
              onClick={() => scrollToSection("visualization")}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
            >
              Visualization
            </button>
            <button
              onClick={() => scrollToSection("solution")}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
            >
              Solution
            </button>
            <button
              onClick={() => scrollToSection("order-form")}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
            >
              Get Started
            </button>
          </nav>
        </header>

        {/* Notification Banner */}
        <div className="flex justify-center mt-6 md:mt-8 px-4 md:px-0">
          <button
            onClick={() => scrollToSection("order-form")}
            className="flex items-center gap-2 bg-black/50 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-black/60 transition-colors text-sm md:text-base w-full md:w-auto justify-center"
          >
            Limited Time Offer: First 48 hours - Only $29 <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* HERO Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="max-w-4xl mx-auto">
                <span className="text-4xl md:text-6xl font-bold leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-500 block">
                  Struggling to manifest what you desire?
                </span>
                <span className="text-3xl md:text-4xl font-medium mt-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-500 block">
                  It's all about effective visualization.
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto">
                Unlock the fastest path to your dream reality with a personalized Manifestation Audio — tailored to
                reprogram your subconscious and make visualization effortless.
              </p>

              <div className="flex justify-center mb-6">
                <RebelButton className="text-lg" onClick={() => scrollToSection("order-form")}>
                  Start Your Manifestation Journey
                </RebelButton>
              </div>
              <p className="text-sm text-gray-400 mb-16">Takes just 2 minutes to personalize.</p>

              {/* 3D Visual Element - Brain Image */}
              <div className="w-full max-w-4xl mx-auto mt-8 mb-8">
                <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center bg-transparent">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl blur-xl"></div>
                  <Image
                    src="/images/brain-rewired-processed.png"
                    alt="Colorful visualization of neural connections in the brain"
                    width={700}
                    height={400}
                    className="relative z-10 object-contain max-h-full"
                    priority
                    style={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — Why You're Stuck */}
        <section id="why-stuck" className="py-24 bg-[#0c0c14]">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                You've Tried Manifesting. You've Visualized. Yet Something Still Feels Blocked.
              </h2>
              <p className="text-lg text-gray-300 mb-12">
                Most manifestation techniques fail because they don't reach the one place that shapes 95% of your
                thoughts, emotions, and habits: your subconscious mind. If your subconscious doesn't believe you deserve
                more, no matter how hard you try — you stay stuck.
              </p>

              {/* Cycle Diagram */}
              <div className="max-w-2xl mx-auto bg-[#151515] p-8 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-medium mb-6 text-white">The Manifestation Cycle</h3>
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                      <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                    <span className="text-white font-medium">Thoughts</span>
                  </div>
                  <ArrowRight className="hidden md:block w-6 h-6 text-amber-500" />
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <span className="text-white font-medium">Actions</span>
                  </div>
                  <ArrowRight className="hidden md:block w-6 h-6 text-amber-500" />
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mb-3">
                      <Moon className="w-8 h-8 text-violet-400" />
                    </div>
                    <span className="text-white font-medium">Habits</span>
                  </div>
                  <ArrowRight className="hidden md:block w-6 h-6 text-amber-500" />
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                      <div className="w-8 h-8 text-amber-400 flex items-center justify-center font-bold">✨</div>
                    </div>
                    <span className="text-white font-medium">Reality</span>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <p className="text-center text-amber-400 font-medium">
                    Your subconscious influences every step of this cycle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Why Visualization is Hard */}
        <section id="visualization" className="py-24">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                Visualization is difficult.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
                <Card className="bg-[#151515] border-none shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full bg-purple-500/20">
                      <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Lack of Clarity</h3>
                    <p className="text-gray-400">
                      You're not clear on what you truly want or how to visualize it effectively.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#151515] border-none shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-500/20">
                      <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Emotional Distance</h3>
                    <p className="text-gray-400">
                      You struggle to feel your desires as real and already manifested in your life.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#151515] border-none shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full bg-violet-500/20">
                      <Moon className="w-6 h-6 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Mental Noise</h3>
                    <p className="text-gray-400">
                      Your mind is clouded with doubts, distractions, and negative thought patterns.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-lg text-gray-300 mt-12">
                Without clarity, repetition, and emotional conviction — the subconscious stays exactly where it is.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 — ManifestVault Solution */}
        <section id="solution" className="py-24 bg-[#0c0c14]">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                ManifestVault: Your Shortcut to Unstoppable Manifestation.
              </h2>
              <p className="text-lg text-gray-300 mb-12">
                Our Personalized Manifestation Audios are crafted specifically for you — based on your dreams, your
                struggles, and your energy.
                <br />
                <br />
                Each word, tone, and structure is designed to rewire your subconscious, strengthen your visualization,
                and tune your vibration to the reality you desire.
              </p>

              <div className="flex justify-center mb-16">
                <RebelButton className="text-lg" onClick={() => scrollToSection("order-form")}>
                  Create Your Personalized Audio
                </RebelButton>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — How It Works */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                How It Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-[#151515] p-8 rounded-xl border border-purple-500/20 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-400 font-bold text-2xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Answer Questions</h3>
                  <p className="text-gray-400">
                    Complete a quick 2-minute questionnaire about your dreams and challenges.
                  </p>
                </div>

                <div className="bg-[#151515] p-8 rounded-xl border border-purple-500/20 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-400 font-bold text-2xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">We Craft Your Audio</h3>
                  <p className="text-gray-400">
                    Our system creates a personalized manifestation audio tailored to your needs.
                  </p>
                </div>

                <div className="bg-[#151515] p-8 rounded-xl border border-purple-500/20 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-400 font-bold text-2xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Listen & Transform</h3>
                  <p className="text-gray-400">
                    Listen daily and watch as your reality begins to shift and align with your desires.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={() => scrollToSection("order-form")}
                  className="bg-transparent hover:bg-purple-500/10 text-purple-400 font-semibold py-2 px-6 border border-purple-500/30 rounded-lg transition-all flex items-center mx-auto"
                >
                  Start Now <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — What's Inside Your Audio */}
        <section className="py-24 bg-[#0c0c14]">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                What You'll Receive:
              </h2>

              <div className="bg-[#151515] p-8 rounded-xl border border-purple-500/20 max-w-2xl mx-auto">
                <ul className="space-y-6 text-left">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300">
                      <span className="text-white font-medium">Custom meditation script</span> based on your dream life
                      and specific barriers
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300">
                      <span className="text-white font-medium">Premium audio engineering</span> for full immersion and
                      deeper subconscious impact
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300">
                      <span className="text-white font-medium">Designed to activate your subconscious</span> daily for
                      faster manifestation results
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300">
                      <span className="text-white font-medium">Sent directly to your inbox</span>, ready to use
                      immediately on any device
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — Testimonial */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="bg-[#151515] p-6 md:p-8 rounded-xl shadow-xl border border-purple-500/20 mb-16 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-500/30 mb-4 md:mb-0">
                  <Image
                    src="/images/emma-t.png"
                    alt="Emma T."
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="text-white font-medium mb-2 text-xl">Emma T., ManifestVault Community Member</div>
                  <p className="text-gray-300 mb-4">
                    "I thought I was bad at manifesting. Turns out, I just needed the right voice guiding my
                    subconscious. ManifestVault unlocked something I didn't know I had. After just 3 weeks of using my
                    custom meditation, I finally had the courage to ask for a promotion at work—and I got it!"
                  </p>

                  <div className="mt-4">
                    <p className="text-sm text-purple-400 mb-2">Listen to a sample of Emma's manifestation audio:</p>
                    <AudioPlayer
                      src="https://axfoyptgkqbhrysntiif.supabase.co/storage/v1/object/public/meditations-samples//emma-meditation.mp3"
                      className="max-w-full md:max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL SECTION — Hard Close */}
        <section className="py-24 bg-[#0c0c14]">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                Your Dream Life Is Closer Than You Think.
              </h2>
              <p className="text-lg text-gray-300 mb-12">
                Visualization is the bridge between wanting and receiving.
                <br />
                <br />
                Don't let doubts, distractions, or subconscious blocks hold you back.
                <br />
                <br />
                Your dreams are waiting. Make them real.
              </p>

              <div className="flex justify-center mb-16">
                <RebelButton className="text-lg" onClick={() => scrollToSection("order-form")}>
                  Start Manifesting Your Dream Life
                </RebelButton>
              </div>

              {/* As Seen In / Based On Section */}
              <div className="mt-16 pt-8 border-t border-gray-800/30">
                <h3 className="text-xl font-medium mb-6 text-gray-400">Based on Neuroscience Principles</h3>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {experts.map((expert, index) => (
                    <div key={index} className="flex flex-col items-center w-[110px] md:w-auto flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-purple-500/30 mb-2">
                        <Image
                          src={expert.image || "/placeholder.svg"}
                          alt={expert.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-white font-medium text-center text-xs md:text-sm">{expert.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Form Section */}
        <section id="order-form" className="py-16">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                Create Your Personalized Manifestation Audio
              </h2>
              <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl mx-auto">
                Answer a few quick questions to help us craft your perfect manifestation tool
              </p>

              {submitSuccess ? (
                <div
                  id="success-message"
                  className="bg-[#151515] p-8 rounded-xl border border-green-500/30 max-w-2xl mx-auto"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Thank You for Your Order!</h3>
                    <p className="text-gray-300 mb-6">
                      Your personalized manifestation audio is being created. We'll deliver it to your email within
                      24-48 hours.
                    </p>
                    <div className="mt-8 pt-6 border-t border-gray-800/30">
                      <p className="text-sm text-gray-400">
                        If you have any questions, please contact us at{" "}
                        <a href="mailto:contact@manifestvault.com" className="text-purple-400 hover:underline">
                          contact@manifestvault.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#151515] rounded-xl p-6 border border-purple-500/20 max-w-3xl mx-auto">
                  <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-medium mb-4 text-white text-center">Tell Us About Your Dreams</h3>

                        <div>
                          <Label htmlFor="specificObjective" className="text-lg">
                            What specific goal or dream do you want to manifest?
                          </Label>
                          <textarea
                            id="specificObjective"
                            rows={4}
                            className="w-full p-3 rounded-md bg-[#0c0c14] text-white border border-gray-700 mt-2 resize-none"
                            placeholder="E.g., I want to manifest a 6-figure business, find my soulmate, move to my dream location..."
                            value={formData.specificObjective}
                            onChange={(e) => setFormData({ ...formData, specificObjective: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="dreamLifeVisualization" className="text-lg">
                            Describe your dream reality in vivid detail
                          </Label>
                          <textarea
                            id="dreamLifeVisualization"
                            rows={6}
                            className="w-full p-3 rounded-md bg-[#0c0c14] text-white border border-gray-700 mt-2 resize-none"
                            placeholder="Describe how your life looks, feels, and sounds when your dream is realized. Be specific and sensory-rich."
                            value={formData.dreamLifeVisualization}
                            onChange={(e) => setFormData({ ...formData, dreamLifeVisualization: e.target.value })}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            The more detailed and sensory-rich your description, the more powerful your manifestation
                            audio will be.
                          </p>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-medium mb-4 text-white text-center">Identify Your Blocks</h3>

                        <div>
                          <Label htmlFor="limitingBeliefs" className="text-lg">
                            What limiting beliefs might be holding you back?
                          </Label>
                          <textarea
                            id="limitingBeliefs"
                            rows={4}
                            className="w-full p-3 rounded-md bg-[#0c0c14] text-white border border-gray-700 mt-2 resize-none"
                            placeholder="E.g., I don't deserve success, Money is hard to come by, I'm not good enough..."
                            value={formData.limitingBeliefs}
                            onChange={(e) => setFormData({ ...formData, limitingBeliefs: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="consciousStruggles" className="text-lg">
                            What conscious struggles do you face when trying to manifest?
                          </Label>
                          <textarea
                            id="consciousStruggles"
                            rows={4}
                            className="w-full p-3 rounded-md bg-[#0c0c14] text-white border border-gray-700 mt-2 resize-none"
                            placeholder="E.g., I can't focus during visualization, I doubt myself, I get distracted easily..."
                            value={formData.consciousStruggles}
                            onChange={(e) => setFormData({ ...formData, consciousStruggles: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-medium mb-4 text-white text-center">Customize Your Experience</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                              id="name"
                              className="bg-[#0c0c14] border-gray-700 mt-2"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                              placeholder="For personalization"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Your Email</Label>
                            <Input
                              id="email"
                              type="email"
                              className="bg-[#0c0c14] border-gray-700 mt-2"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                              placeholder="To receive your audio"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="meditationStyle">Manifestation Style</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, meditationStyle: value })}>
                              <SelectTrigger id="meditationStyle" className="bg-[#0c0c14] border-gray-700 mt-2">
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#151515] border-gray-700">
                                <SelectItem value="visualization">Guided Visualization</SelectItem>
                                <SelectItem value="affirmation">Positive Affirmations</SelectItem>
                                <SelectItem value="hypnotic">Hypnotic Suggestions</SelectItem>
                                <SelectItem value="mindfulness">Mindfulness & Presence</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="voiceGender">Voice Preference</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, voiceGender: value })}>
                              <SelectTrigger id="voiceGender" className="bg-[#0c0c14] border-gray-700 mt-2">
                                <SelectValue placeholder="Select voice" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#151515] border-gray-700">
                                <SelectItem value="male">Male Voice</SelectItem>
                                <SelectItem value="female">Female Voice</SelectItem>
                                <SelectItem value="neutral">Gender Neutral Voice</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">Total</span>
                            <span className="text-white font-bold">$29.00</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-2">
                            One-time payment for lifetime access to your personalized manifestation audio
                          </p>
                        </div>

                        {submitError && (
                          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-200 text-sm">
                            {submitError}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between mt-8">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="bg-transparent hover:bg-gray-700/50 text-gray-300 font-medium py-2 px-6 rounded-md transition-all"
                        >
                          Back
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={isSubmitting}
                        className={`ml-auto bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-8 rounded-md transition-all transform hover:scale-[1.02] shadow-lg ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting
                          ? "Processing..."
                          : currentStep < totalSteps - 1
                            ? "Continue"
                            : "Complete Purchase"}
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-800/30 flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Secure payment powered by Stripe</span>
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-xs text-gray-500">
                        Get a free Visualization Blueprint PDF when you complete your order!
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-800/30">
          <div className="container mx-auto px-4 max-w-full md:max-w-[90%] lg:max-w-[1200px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-4 md:mb-0">
                <h3 className="text-amber-500 font-bold text-xl mb-2">ManifestVault</h3>
                <p className="text-gray-400 text-sm max-w-md">
                  Personalized manifestation audios to transform your subconscious mind and manifest the life you
                  desire.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-end">
                <div className="flex space-x-4 mb-4">
                  <a
                    href="https://www.instagram.com/manifest.vault/?utm_source=ig_web_button_share_sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@manifest.vault"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <TikTokIcon className="w-6 h-6" />
                  </a>
                </div>
                <ContactDialog />
              </div>
            </div>

            <div className="text-center border-t border-gray-800/30 pt-6">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} ManifestVault. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                <Link href="/terms" className="hover:text-gray-400">
                  Terms of Service
                </Link>{" "}
                |{" "}
                <Link href="/privacy" className="hover:text-gray-400">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
