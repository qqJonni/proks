import { useState } from 'react'

const clients = [
  'ПНОС', 'ОДК «Авиадвигатели»', 'Мотовилихинские заводы',
  '«Протон-ПМ»', 'КБФ-Гознак', '«Уралкалий»',
  '«ЕвроХим»', 'Яйвинская ГРЭС', 'Кунгурское ЛПУМГ',
]

export default function ContactsOverlay() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', description: '' })

  return (
    <section id="contacts" className="py-20 md:py-32 px-5 md:px-16">
      <div className="max-w-6xl mx-auto w-full">
        {/* Clients */}
        <div className="mb-10 md:mb-12">
          <p className="text-[#2b7bd2] text-xs md:text-sm tracking-[0.3em] uppercase mb-3 md:mb-4 font-heading">Заказчики</p>
          <h2 className="font-heading text-2xl md:text-3xl font-light mb-6 md:mb-8">
            Нам доверяют <span className="font-semibold">лидеры отрасли</span>
          </h2>
          <div className="flex flex-wrap gap-2 md:gap-3 pointer-events-auto">
            {clients.map((client) => (
              <div key={client} className="glass-light rounded-lg px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm text-white/70">
                {client}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Contact info */}
          <div>
            <h3 className="font-heading text-xl md:text-2xl font-semibold mb-4 md:mb-6">Контакты</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="glass rounded-xl p-4 md:p-5">
                <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-wider mb-1">Адрес</p>
                <p className="text-white/90 text-sm md:text-base">г. Пермь, ул. Революции, д. 8</p>
              </div>
              <div className="glass rounded-xl p-4 md:p-5">
                <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-wider mb-1">Телефон</p>
                <a href="tel:+73422069800" className="text-white/90 font-heading text-base md:text-lg pointer-events-auto">+7 (342) 206-98-00</a>
              </div>
              <div className="glass rounded-xl p-4 md:p-5">
                <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-wider mb-1">Email</p>
                <p className="text-white/90 text-sm md:text-base">2388303@mail.ru</p>
                <p className="text-white/50 text-xs md:text-sm mt-1">ok@proks59.ru — для резюме</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h3 className="font-heading text-xl md:text-2xl font-semibold mb-4 md:mb-6">Предложить проект</h3>
            <div className="glass rounded-xl p-4 md:p-6 space-y-3 md:space-y-4 pointer-events-auto">
              <input type="text" placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#2b7bd2]/50 transition-colors" />
              <input type="text" placeholder="Компания" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#2b7bd2]/50 transition-colors" />
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <input type="tel" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#2b7bd2]/50 transition-colors" />
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#2b7bd2]/50 transition-colors" />
              </div>
              <textarea placeholder="Описание проекта" rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#2b7bd2]/50 transition-colors resize-none" />
              <button className="w-full bg-[#2b7bd2] hover:bg-[#3a8be2] text-white font-heading font-medium py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base">
                Отправить заявку
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-white/30 text-[10px] md:text-xs">
          <p>© 2016–2026 ООО «ПРОКС». Все права защищены.</p>
          <p>Информация на сайте не является публичной офертой</p>
        </div>
      </div>
    </section>
  )
}
