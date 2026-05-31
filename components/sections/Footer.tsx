export function Footer() {
  return (
    <footer
      className="py-12 px-6 flex flex-col items-center gap-6 border-t border-white/5"
      style={{ background: 'var(--zone-5-bg)' }}
    >
      <div className="flex gap-6">
        {[
          { label: 'TikTok', url: 'https://tiktok.com/@flamingeos' },
          { label: 'Instagram', url: 'https://instagram.com/flamingeos' },
          { label: 'YouTube', url: 'https://youtube.com/c/flamingeos' },
        ].map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/30 hover:text-white/70 transition-colors tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {s.label}
          </a>
        ))}
      </div>
      <p className="text-xs text-white/20" style={{ fontFamily: 'var(--font-mono)' }}>
        © 2026 FLAMINGEOS
      </p>
      <p className="text-xs text-white/15 italic" style={{ fontFamily: 'var(--font-quote)' }}>
        From Puerto Rico, to wherever is next.
      </p>
    </footer>
  )
}
