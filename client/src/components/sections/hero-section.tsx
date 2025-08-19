import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Profile } from "@shared/schema";
import whiteRippleImage from "@assets/generated_images/White_ripple_waves_pattern_9e070c09.png";

export default function HeroSection() {
  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  // Показываем ошибку, если профиль не найден
  if (error) {
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h1 className="text-50 font-extrabold mb-6">Профиль не настроен</h1>
              <p className="text-24 mb-8">Данные профиля отсутствуют. Обратитесь к администратору.</p>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

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
          {isLoading ? (
            // Скелетон загрузки
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="animate-pulse">
                <div className="h-16 bg-white/20 rounded-lg mb-6 mx-auto max-w-2xl"></div>
                <div className="h-8 bg-white/20 rounded-lg mb-4 mx-auto max-w-3xl"></div>
                <div className="h-8 bg-white/20 rounded-lg mb-8 mx-auto max-w-xl"></div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="h-14 w-40 bg-white/20 rounded-lg mx-auto sm:mx-0"></div>
                  <div className="h-14 w-40 bg-white/20 rounded-lg mx-auto sm:mx-0"></div>
                </div>
              </div>
            </motion.div>
          ) : profile ? (
            // Контент с анимацией
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-50 font-extrabold text-white mb-6 leading-tight drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {profile.firstName}
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {profile.lastName}
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-24 font-regular text-gray-100 mb-8 leading-relaxed drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {profile.description}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={scrollToContact}
                    className="bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Связаться
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={scrollToPortfolio}
                    variant="outline"
                    className="border-2 border-white text-white px-8 py-4 text-16 font-semibold hover:bg-white hover:text-black transition-colors backdrop-blur-sm"
                  >
                    Узнать больше
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
