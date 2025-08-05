import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Service } from "@shared/schema";

export default function ServicesSection() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-50 font-extrabold text-center text-black mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Мои Услуги
          </motion.h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-gray-50 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-50 font-extrabold text-center text-black mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Мои Услуги
          </motion.h2>
          <motion.div 
            className="text-center text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-24">Услуги не добавлены</p>
            <p className="text-16 mt-2">Добавьте услуги через админ-панель</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-50 font-extrabold text-center text-black mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Мои Услуги
        </motion.h2>
        
        <motion.div 
          className="max-w-4xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.id} 
              className="bg-gray-50 rounded-lg overflow-hidden"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <motion.button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
                onClick={() => toggleService(service.id)}
                whileHover={{ backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-24 font-semibold text-black">{service.title}</h3>
                <motion.div
                  animate={{ rotate: expandedService === service.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-black" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {expandedService === service.id && (
                  <motion.div 
                    className="px-6 pb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <h4 className="text-16 font-semibold text-black mb-2">Что входит в услугу:</h4>
                        <ul className="text-15 font-regular text-gray-600 space-y-1">
                          {service.includes.map((item, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                            >
                              • {item}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <h4 className="text-16 font-semibold text-black mb-2">Для кого:</h4>
                        <p className="text-15 font-regular text-gray-600 mb-4">
                          {service.targetAudience}
                        </p>
                        <h4 className="text-16 font-semibold text-black mb-2">Формат работы:</h4>
                        <p className="text-15 font-regular text-gray-600 mb-4">
                          {service.workFormat}
                        </p>
                        <h4 className="text-16 font-semibold text-black mb-2">Стоимость:</h4>
                        <p className="text-16 font-semibold text-black">{service.price}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
