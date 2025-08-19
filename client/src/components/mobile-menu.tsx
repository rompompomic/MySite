import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-20 font-semibold">Меню</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-6">
          <div className="space-y-4">
            <button
              onClick={() => onNavigate("about")}
              className="block w-full text-left text-16 font-regular hover:text-gray-600 transition-colors py-2"
            >
              Обо мне
            </button>
            <button
              onClick={() => onNavigate("portfolio")}
              className="block w-full text-left text-16 font-regular hover:text-gray-600 transition-colors py-2"
            >
              Кейсы
            </button>
            <button
              onClick={() => onNavigate("services")}
              className="block w-full text-left text-16 font-regular hover:text-gray-600 transition-colors py-2"
            >
              Услуги
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="block w-full text-left text-16 font-regular hover:text-gray-600 transition-colors py-2"
            >
              Контакты
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
