import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { PortfolioItem } from "@shared/schema";

export default function PortfolioSection() {
  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

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
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-50 font-extrabold text-center text-black mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Мои Работы
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-50 font-extrabold text-center text-black mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Мои Работы
          </motion.h2>
          <motion.div 
            className="text-center text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-24">Кейсы пока пусты</p>
            <p className="text-16 mt-2">Добавьте работы через админ-панель</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
  <section id="portfolio" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-50 font-extrabold text-center text-black mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Мои Работы
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {portfolioItems.map((item, index) => {
            const content = (
              <>
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-24 font-semibold text-black mb-2">{item.title}</h3>
                  <p className="text-16 font-regular text-gray-600">{item.description}</p>
                  {item.hasLink && item.linkUrl && (
                    <p className="text-14 font-medium text-blue-600 mt-2">
                      Перейти к проекту →
                    </p>
                  )}
                </div>
              </>
            );

            if (item.hasLink && item.linkUrl) {
              return (
                <motion.a
                  key={item.id}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer block"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {content}
                </motion.a>
              );
            }

            return (
              <motion.div 
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {content}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
