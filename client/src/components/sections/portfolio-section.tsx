import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem } from "@shared/schema";

export default function PortfolioSection() {
  const { data: portfolioItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  if (portfolioItems.length === 0) {
    return (
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-50 font-extrabold text-center text-black mb-16">Мои Работы</h2>
          <div className="text-center text-gray-600">
            <p className="text-24">Портфолио пока пусто</p>
            <p className="text-16 mt-2">Добавьте работы через админ-панель</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-50 font-extrabold text-center text-black mb-16">Мои Работы</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-24 font-semibold text-black mb-2">{item.title}</h3>
                <p className="text-16 font-regular text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
