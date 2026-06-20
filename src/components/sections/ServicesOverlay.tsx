const services = [
  {
    title: 'Устройство свайного основания',
    description: 'Забивные, буронабивные, буроинъекционные сваи любого типа и масштаба',
    icon: '⬡',
  },
  {
    title: 'Геотехнические работы',
    description: 'Полный цикл подземного строительства при новом строительстве, реконструкции и в плотной городской застройке',
    items: [
      'Закрепление грунтов',
      'Усиление фундаментов',
      'Ограждение котлованов',
      'Грунтовые анкеры',
      'Противофильтрационные завесы',
      'Противокарстовые мероприятия',
    ],
    icon: '◈',
  },
  {
    title: 'Генеральный подряд «под ключ»',
    description: 'Координация архитекторов, инженеров, субподрядчиков и поставщиков на всех этапах строительства',
    icon: '◇',
  },
]

export default function ServicesOverlay() {
  return (
    <section id="services" className="py-20 md:py-32 px-5 md:px-16">
      <div className="max-w-5xl mx-auto w-full">
        <p className="text-[#2b7bd2] text-xs md:text-sm tracking-[0.3em] uppercase mb-3 md:mb-4 font-heading">Услуги</p>
        <h2 className="font-heading text-2xl md:text-4xl font-light mb-8 md:mb-10">
          Комплексные решения <span className="font-semibold">для каждого этапа</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.title} className="glass rounded-xl p-5 md:p-8 pointer-events-auto">
              <div className="text-[#2b7bd2] text-2xl md:text-3xl mb-3 md:mb-4">{service.icon}</div>
              <h3 className="font-heading text-base md:text-lg font-semibold mb-2 md:mb-3">{service.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-3 md:mb-4">{service.description}</p>
              {service.items && (
                <ul className="space-y-1.5">
                  {service.items.map((item) => (
                    <li key={item} className="text-white/50 text-xs flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#2b7bd2] rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
