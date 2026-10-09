import { pageTitle } from '../app/brand'
import {
  ConciergePreviewSection,
  ConsultationPreviewSection,
  FeaturedProductsSection,
  FinalCtaSection,
  HelpSection,
  HeroSection,
  NextSlotsSection,
} from '../features/home/HomeSections'

export function HomePage() {
  return (
    <>
      <title>{pageTitle('Des intérieurs pensés pour durer')}</title>
      <HeroSection />
      <FeaturedProductsSection />
      <HelpSection />
      <ConsultationPreviewSection />
      <ConciergePreviewSection />
      <NextSlotsSection />
      <FinalCtaSection />
    </>
  )
}
