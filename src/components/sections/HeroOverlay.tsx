export default function HeroOverlay() {
  return (
    <section id="hero" className="h-screen flex flex-col justify-between px-5 md:px-16 pt-20">
      <div />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-3xl px-2">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Строим{' '}
            <span className="text-[#2b7bd2] font-semibold">будущее</span>
            <br />
            от фундамента до ключа
          </h2>
          <p className="text-white/50 mt-4 md:mt-6 text-base md:text-lg max-w-xl mx-auto">
            Полный цикл строительно-монтажных работ собственной базой
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 pb-6 md:pb-8">
        <p className="text-white/30 text-xs tracking-[0.2em] uppercase">Прокрутите вниз</p>
        <div className="w-px h-10 md:h-12 bg-gradient-to-b from-white/50 to-transparent scroll-indicator" />
      </div>
    </section>
  )
}
