'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LoadingExperience } from '@/components/sections/LoadingExperience'
import { Hero } from '@/components/sections/Hero'
import { Story } from '@/components/sections/Story'
import { Timeline } from '@/components/sections/Timeline'
import { World } from '@/components/sections/World'
import { Stats } from '@/components/sections/Stats'
import { Brands } from '@/components/sections/Brands'
import { JoinTheJourney } from '@/components/sections/JoinTheJourney'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  const [loading, setLoading] = useState<boolean | null>(null)

  useEffect(() => {
    const seen = localStorage.getItem('geo_visited')
    setLoading(!seen)
  }, [])

  if (loading === null) return null

  const handleLoadingComplete = () => {
    localStorage.setItem('geo_visited', 'true')
    setLoading(false)
  }

  return (
    <>
      <AnimatePresence>
        {loading === true && (
          <LoadingExperience onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <main>
        <Hero />
        <Story />
        <Timeline />
        <World />
        <Stats />
        <Brands />
        <JoinTheJourney />
        <Footer />
      </main>
    </>
  )
}
