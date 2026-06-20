import { useState } from 'react'
import { useScrollStore } from '../scrollStore'

const navItems = [
  { label: 'Главная', id: 'hero' },
  { label: 'О компании', id: 'about' },
  { label: 'Услуги', id: 'services' },
  { label: 'Объекты', id: 'portfolio' },
  { label: 'Заказчики', id: 'contacts' },
  { label: 'Контакты', id: 'contacts' },
]

const mobileExtra = [
  { label: 'Жилые объекты', id: 'portfolio' },
  { label: 'Промышленные объекты', id: 'portfolio' },
  { label: 'Устройство свайного основания', id: 'services' },
  { label: 'Геотехнические работы', id: 'services' },
]

function scrollToId(id: string) {
  const el = document.getElementById(id)
  const container = document.getElementById('scroll-root')
  if (el && container) {
    const top = el.offsetTop - 60
    container.scrollTo({ top, behavior: 'smooth' })
  }
}

export default function Nav() {
  const progress = useScrollStore((s) => s.progress)
  const isScrolled = progress > 0.03
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
        isScrolled ? 'glass py-2 md:py-3' : 'py-3 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <button
          onClick={() => scrollToId('hero')}
          className="font-heading text-lg md:text-xl font-bold tracking-tight hover:text-[#2b7bd2] transition-colors pointer-events-auto"
        >
          ПРОКС
        </button>

        <div className="hidden md:flex items-center gap-1 pointer-events-auto">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToId(item.id)}
              className="px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        <a
          href="tel:+73422069800"
          className="hidden lg:block text-sm text-white/60 hover:text-[#2b7bd2] transition-colors pointer-events-auto font-heading"
        >
          +7 (342) 206-98-00
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 pointer-events-auto"
        >
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass mt-2 mx-3 rounded-xl p-4 flex flex-col gap-1 pointer-events-auto">
          {[...navItems, ...mobileExtra].map((item, i) => (
            <button
              key={i}
              onClick={() => { scrollToId(item.id); setMenuOpen(false) }}
              className="text-left text-white/70 hover:text-white text-sm py-2 border-b border-white/5 last:border-0"
            >
              {item.label}
            </button>
          ))}
          <a href="tel:+73422069800" className="text-[#2b7bd2] text-sm mt-2 font-heading">
            +7 (342) 206-98-00
          </a>
        </div>
      )}
    </nav>
  )
}
