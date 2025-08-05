import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Profile } from "@shared/schema";

export default function HeroSection() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToPortfolio = () => {
    const element = document.getElementById("portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="min-h-screen flex items-center justify-center bg-white pt-20">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-50 font-extrabold text-black mb-6 leading-tight">
            <span>{profile?.firstName || "John"}</span>{" "}
            <span>{profile?.lastName || "Wayne"}</span>
          </h1>
          <p className="text-24 font-regular text-gray-600 mb-8 leading-relaxed">
            {profile?.description || 
              "Профессиональный веб-разработчик и дизайнер с опытом создания современных цифровых решений. Специализируюсь на разработке пользовательских интерфейсов и создании незабываемого пользовательского опыта."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToContact}
              className="bg-black px-8 py-4 font-semibold hover:bg-gray-800 transition-colors text-[#ffffff]"
            >
              Связаться
            </Button>
            <Button
              onClick={scrollToPortfolio}
              variant="outline"
              className="border-2 border-black text-black px-8 py-4 text-16 font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
