import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Contact } from "@shared/schema";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts } = useQuery<Contact>({
    queryKey: ["/api/contacts"],
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Сообщение отправлено",
      });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-50 font-extrabold text-center text-black mb-16">Связаться со Мной</h2>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-16 font-semibold text-black mb-2">
                Имя
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-16 font-regular"
                placeholder="Ваше имя"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-16 font-semibold text-black mb-2">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-16 font-regular"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="block text-16 font-semibold text-black mb-2">
                Сообщение
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-16 font-regular resize-none"
                placeholder="Расскажите о вашем проекте..."
              />
            </div>
            
            <Button
              type="submit"
              disabled={contactMutation.isPending}
              className="w-full bg-black py-4 font-semibold hover:bg-gray-800 transition-colors text-[#f9fafb]"
            >
              {contactMutation.isPending ? "Отправляем..." : "Отправить Сообщение"}
            </Button>
          </form>
          
          <div className="flex justify-center space-x-8 mt-12">
            {contacts?.telegram && (
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.91 1.21-5.41 3.56-.51.35-.97.52-1.38.52-.45-.01-1.32-.26-1.97-.47-.8-.26-1.44-.4-1.38-.85.03-.23.36-.47.98-.72 3.85-1.68 6.43-2.79 7.73-3.34 3.68-1.55 4.45-1.82 4.95-1.83.11 0 .35.03.51.17.13.12.17.27.18.38-.01.06.01.24-.02.37z"/>
                </svg>
                <span className="text-16 font-regular">Telegram</span>
              </a>
            )}
            {contacts?.github && (
              <a
                href={contacts.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span className="text-16 font-regular">GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
