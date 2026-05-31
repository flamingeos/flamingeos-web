'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'

const SOCIALS = [
  { platform: 'TikTok', handle: '@flamingeos', followers: '2.5M', url: 'https://tiktok.com/@flamingeos', color: '#a8d8ff' },
  { platform: 'Instagram', handle: '@flamingeos', followers: '913K', url: 'https://instagram.com/flamingeos', color: '#f97316' },
  { platform: 'YouTube', handle: 'Flamingeos', followers: '520K', url: 'https://youtube.com/c/flamingeos', color: '#c9a84c' },
  { platform: 'Twitch', handle: 'flamingeos', followers: '', url: 'https://twitch.tv/flamingeos', color: '#22d3ee' },
]

const BUDGETS = ['Under $5K', '$5K–$10K', '$10K–$50K', '$50K+', "Let's talk"]

function SocialCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
      {SOCIALS.map((s, i) => (
        <motion.a
          key={s.platform}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <GlassCard className="p-5 text-center h-full">
            <p
              className="text-lg font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: s.color }}
            >
              {s.platform}
            </p>
            <p className="text-xs text-white/40">{s.handle}</p>
            {s.followers && (
              <p
                className="text-2xl font-bold mt-3"
                style={{ fontFamily: 'var(--font-display)', color: s.color }}
              >
                {s.followers}
              </p>
            )}
          </GlassCard>
        </motion.a>
      ))}
    </div>
  )
}

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', brand: '', email: '', message: '', budget: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', brand: '', email: '', message: '', budget: '' })
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error('[contact form]', err)
      setStatus('error')
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors'

  if (status === 'success') {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Message received.
        </p>
        <p className="text-white/50 text-sm">We will be in touch soon.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className={inputClass} />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand / Company" className={inputClass} />
      </div>
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className={inputClass} />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about the project..." required rows={4} className={`${inputClass} resize-none`} />
      <select name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
        <option value="" disabled>Budget range</option>
        {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      <motion.button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-4 font-bold tracking-widest text-sm uppercase text-black rounded-lg disabled:opacity-50"
        style={{ background: 'var(--zone-5-accent)', fontFamily: 'var(--font-display)' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </motion.button>
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>
      )}
    </form>
  )
}

export function JoinTheJourney() {
  return (
    <section
      className="section flex-col gap-20 py-32"
      style={{ background: 'var(--zone-5-bg)' }}
      id="join"
    >
      {/* Follow the Adventure */}
      <div className="flex flex-col items-center gap-8 w-full px-6">
        <motion.h2
          className="text-chapter text-white text-center"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Follow the Adventure
        </motion.h2>
        <SocialCards />
      </div>

      {/* Divider */}
      <div className="w-px h-24 bg-white/10" />

      {/* Work Together */}
      <div className="flex flex-col items-center gap-8 w-full px-6">
        <motion.h2
          className="text-chapter text-white text-center"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work Together
        </motion.h2>
        <motion.p
          className="text-white/40 text-sm text-center max-w-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Brand partnerships, sponsored content, and collaborations.
        </motion.p>
        <ContactForm />
      </div>
    </section>
  )
}
