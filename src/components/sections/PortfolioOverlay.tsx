import { useState } from 'react'

type Category = 'all' | 'residential' | 'social' | 'industrial'

const categories: { key: Category; label: string; shortLabel: string; count?: number }[] = [
  { key: 'all', label: 'Все', shortLabel: 'Все', count: 25 },
  { key: 'residential', label: 'Жилые', shortLabel: 'Жилые', count: 19 },
  { key: 'social', label: 'Социальные', shortLabel: 'Соц.' },
  { key: 'industrial', label: 'Промышленные', shortLabel: 'Пром.', count: 6 },
]

const projects = [
  { name: 'ЖК Ультима Сити', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3562-3164-4564-b739-336136346130/D0TxjEfQIohNy9BI9awi.jpg' },
  { name: 'Клубный дом на Баумана', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6438-6434-4638-a666-323430396566/WMJu5E62fBsTxWtsed6d.jpg' },
  { name: 'Городские кварталы Талан', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3939-6534-4262-b237-343261316537/zB2i-79JDQxdp9pFr24S.jpg' },
  { name: 'ЖК Доминант', category: 'residential' as const, location: 'г. Пермь, ул. Луначарского, 99', period: 'II кв. 2018 — IV кв. 2018', image: 'https://static.tildacdn.com/tild6436-3138-4138-a263-646637646334/bufD4-EN_XmpTurPFPr_.jpg' },
  { name: 'ЖК Эпоха', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3564-3365-4461-b464-353831313139/YOCkFh1Mky5RMSennbAB.jpg' },
  { name: 'ЖК Ветлан', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3938-3261-4063-a362-373638623136/MFtoqtTIoy_mn4LalvXY.jpg' },
  { name: 'Клубный дом Собрание', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6636-3833-4134-b035-643537343963/wgaSFYBjqD2H8mgzoMlb.jpg' },
  { name: 'ЖК Фаворит', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3465-6632-4433-b635-303436633536/21AH3YPbAh5jEA4SHiz_.jpg' },
  { name: 'ЖК Камаполис', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6238-3336-4737-b538-333831616534/q0SzJ8LGxHziX-1ihmxH.jpg' },
  { name: 'ЖК Архитектор', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6132-3763-4062-a533-333961306261/___48_-_02_20240723_.jpg' },
  { name: 'Клубный дом HYGGE', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6635-3732-4233-a564-376138373136/pGj7rpYkCFvLlqXJF0Wm.jpg' },
  { name: 'ЖК Олимп', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6333-6638-4037-a633-336630343037/AzvUl30gGy4NjsjpJfk1.jpg' },
  { name: 'ЖК Остров', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3365-3134-4436-b836-373664386333/5Cj5_8ev3s7gtczs6PNI.jpg' },
  { name: 'ЖК Гулливер', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6261-6461-4738-b931-363337623561/AtUF2TER7ZDEOJlEyqwf.jpg' },
  { name: 'Микрорайон Ива', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3761-6637-4462-b462-373031303461/FZKItlL4Y8tzRrhPYBaa.jpg' },
  { name: 'ЖК Капитан', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3535-3564-4363-b433-303066626636/kHFRZ7I1J-jBsYnlI1wo.jpg' },
  { name: 'ЖК Веларт', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6238-3430-4633-b037-336132383230/9N96qVpdFA3bhkTloR4K.jpg' },
  { name: 'ЖК Дуэт', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3139-6164-4636-a366-626263616464/a14aQTn02T2Nzb8M23cf.jpg' },
  { name: 'ЖД Старт', category: 'residential' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3937-3265-4862-b562-646463393438/24tspcfg6vmlefed7bvr.jpeg' },
  { name: 'ПНОС', category: 'industrial' as const, location: 'Пермский край', image: 'https://static.tildacdn.com/tild3363-3335-4561-a638-613966326533/87vpftszxw4y8as052b9.jpg' },
  { name: 'ОДК «Авиадвигатели»', category: 'industrial' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild6132-3066-4632-a137-623962653136/1.jpg' },
  { name: 'Мотовилихинские заводы', category: 'industrial' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3332-3130-4938-b661-313436623830/KoddOe0xBvmaDiFTQCjQ.jpg' },
  { name: '«Протон-ПМ»', category: 'industrial' as const, location: 'г. Пермь', image: 'https://static.tildacdn.com/tild3632-3437-4332-b062-393136323635/10qjMrmwolIoWakCJfoQ.jpg' },
  { name: '«Уралкалий»', category: 'industrial' as const, location: 'Пермский край', image: 'https://static.tildacdn.com/tild6130-6536-4637-b130-623465623762/nA_Tzw5hTAom4eLxCwtm.jpg' },
  { name: '«ЕвроХим»', category: 'industrial' as const, location: 'Пермский край', image: 'https://static.tildacdn.com/tild6439-6562-4936-b136-646162393037/9N96qVpdFA3bhkTloR4K.jpg' },
]

export default function PortfolioOverlay() {
  const [filter, setFilter] = useState<Category>('all')
  const [lightbox, setLightbox] = useState<{ image: string; name: string; location: string; period?: string } | null>(null)
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="portfolio" className="py-20 md:py-32 px-5 md:px-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-6 md:mb-8">
          <p className="text-[#2b7bd2] text-xs md:text-sm tracking-[0.3em] uppercase mb-3 md:mb-4 font-heading">Портфолио</p>
          <h2 className="font-heading text-2xl md:text-4xl font-light mb-5 md:mb-0">
            Наши <span className="font-semibold">объекты</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8 pointer-events-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm transition-all ${
                filter === cat.key
                  ? 'bg-[#2b7bd2] text-white'
                  : 'glass text-white/60 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.shortLabel}</span>
              {cat.count != null && <>{' '}<span className="text-white/40">{cat.count}</span></>}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {filtered.map((project) => (
            <div
              key={project.name}
              onClick={() => setLightbox(project)}
              className="glass rounded-xl overflow-hidden group hover:border-[#2b7bd2]/30 transition-all cursor-pointer pointer-events-auto"
            >
              <div className="aspect-[4/3] bg-white/5 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-heading text-xs md:text-sm font-medium mb-1 group-hover:text-[#2b7bd2] transition-colors leading-snug">
                  {project.name}
                </h3>
                <p className="text-white/40 text-[10px] md:text-xs">{project.location}</p>
                {project.period && (
                  <p className="text-white/30 text-[10px] md:text-xs mt-0.5">{project.period}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/60 hover:text-white text-3xl font-light z-10"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <div
            className="max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image}
              alt={lightbox.name}
              className="w-full rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="font-heading text-lg md:text-xl font-semibold">{lightbox.name}</h3>
              <p className="text-white/50 text-sm mt-1">{lightbox.location}</p>
              {lightbox.period && <p className="text-white/30 text-xs mt-1">{lightbox.period}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
