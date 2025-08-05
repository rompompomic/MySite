import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Profile } from "@shared/schema";
import whiteRippleImage from "@assets/generated_images/White_ripple_waves_pattern_9e070c09.png";

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
    <section 
      id="about" 
      className="min-h-screen flex items-center justify-center pt-20 relative"
      style={{
        backgroundImage: `url(${whiteRippleImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-50 font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            <span>{profile?.firstName || "John"}</span>{" "}
            <span>{profile?.lastName || "Wayne"}</span>
          </h1>
          <p className="text-24 font-regular text-gray-100 mb-8 leading-relaxed drop-shadow-md">
            {profile?.description || 
              "Профессиональный веб-разработчик и дизайнер с опытом создания современных цифровых решений. Специализируюсь на разработке пользовательских интерфейсов и создании незабываемого пользовательского опыта."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToContact}
              className="bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Связаться
            </Button>
            <Button
              onClick={scrollToPortfolio}
              variant="outline"
              className="border-2 border-white text-white px-8 py-4 text-16 font-semibold hover:bg-white hover:text-black transition-colors backdrop-blur-sm"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
