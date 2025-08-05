import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MobileMenu from "./mobile-menu";
import type { Profile } from "@shared/schema";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-24 font-extrabold text-black">
              <span>{profile?.firstName || "John"}</span>{" "}
              <span>{profile?.lastName || "Wayne"}</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("about")}
                className="text-16 font-regular hover:text-gray-600 transition-colors"
              >
                Обо мне
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-16 font-regular hover:text-gray-600 transition-colors"
              >
                Портфолио
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-16 font-regular hover:text-gray-600 transition-colors"
              >
                Услуги
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-16 font-regular hover:text-gray-600 transition-colors"
              >
                Контакты
              </button>
            </div>
            <button
              className="md:hidden text-24"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={scrollToSection}
      />
    </>
  );
}
