import HeroOverlay from './sections/HeroOverlay'
import AboutOverlay from './sections/AboutOverlay'
import ServicesOverlay from './sections/ServicesOverlay'
import PortfolioOverlay from './sections/PortfolioOverlay'
import ContactsOverlay from './sections/ContactsOverlay'

export default function Overlays() {
  return (
    <div className="relative z-10 pointer-events-none">
      <HeroOverlay />
      <AboutOverlay />
      <ServicesOverlay />
      <PortfolioOverlay />
      <ContactsOverlay />
    </div>
  )
}
