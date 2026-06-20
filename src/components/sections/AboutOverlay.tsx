import Counter from '../ui/Counter'
import { useScrollStore } from '../../scrollStore'

const stats = [
  { value: 70, suffix: '+', label: 'единиц спецтехники', sublabel: 'на текущих объектах' },
  { value: 400, suffix: '+', label: 'специалистов', sublabel: 'задействованы на стройках' },
  { value: 20, suffix: '+', label: 'компаний-партнёров', sublabel: 'на постоянной основе' },
]

export default function AboutOverlay() {
  const progress = useScrollStore((s) => s.progress)
  const visible = progress >= 0.05

  return (
    <section id="about" className="py-20 md:py-32 px-5 md:px-16">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10 md:mb-12 text-center">
          <p className="text-[#2b7bd2] text-xs md:text-sm tracking-[0.3em] uppercase mb-3 md:mb-4 font-heading">О компании</p>
          <h2 className="font-heading text-2xl md:text-4xl font-light leading-snug">
            От устройства свайного основания
            <br />
            <span className="font-semibold">до сдачи объекта под ключ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center glass rounded-xl p-5 md:p-8 pointer-events-auto">
              <div className="text-4xl md:text-6xl font-bold text-[#2b7bd2] mb-2">
                <Counter end={stat.value} suffix={stat.suffix} visible={visible} />
              </div>
              <p className="text-white/80 text-sm md:text-base font-medium">{stat.label}</p>
              <p className="text-white/40 text-xs mt-1">{stat.sublabel}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <div className="glass-light rounded-xl p-5 md:p-8 max-w-2xl mx-auto">
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              С 2016 года «ПРОКС» выполняет весь спектр строительно-монтажных работ, располагая
              собственной материально-технической базой. Как генподрядчик компания берёт на себя
              полную ответственность за координацию всех участников процесса — от архитекторов
              до субподрядчиков — и обеспечивает сдачу объекта в срок.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
