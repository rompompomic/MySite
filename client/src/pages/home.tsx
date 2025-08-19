import Navigation from "@/components/navigation";
import HeroSection from "@/components/sections/hero-section";
import VideoSection from "@/components/sections/video-section";
import PortfolioSection from "@/components/sections/portfolio-section";
import ServicesSection from "@/components/sections/services-section";
import ContactSection from "@/components/sections/contact-section";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="font-montserrat bg-gray-50">
      <Navigation />
      <HeroSection />
      <VideoSection />
  <PortfolioSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
