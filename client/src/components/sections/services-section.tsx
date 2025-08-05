import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import type { Service } from "@shared/schema";

export default function ServicesSection() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  if (services.length === 0) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-50 font-extrabold text-center text-black mb-16">Мои Услуги</h2>
          <div className="text-center text-gray-600">
            <p className="text-24">Услуги не добавлены</p>
            <p className="text-16 mt-2">Добавьте услуги через админ-панель</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-50 font-extrabold text-center text-black mb-16">Мои Услуги</h2>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
                onClick={() => toggleService(service.id)}
              >
                <h3 className="text-24 font-semibold text-black">{service.title}</h3>
                <ChevronDown 
                  className={`text-black transition-transform ${
                    expandedService === service.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedService === service.id && (
                <div className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-16 font-semibold text-black mb-2">Что входит в услугу:</h4>
                      <ul className="text-15 font-regular text-gray-600 space-y-1">
                        {service.includes.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
