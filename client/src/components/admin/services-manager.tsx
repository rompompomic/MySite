import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, X } from "lucide-react";
import type { Service } from "@shared/schema";

export default function ServicesManager() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    includes: [""],
    targetAudience: "",
    workFormat: "",
    price: "",
    order: "0",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const filteredData = {
        ...data,
        includes: data.includes.filter(item => item.trim() !== "")
      };
      return await apiRequest("POST", "/api/admin/services", filteredData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsAdding(false);
      resetForm();
      toast({
        title: "Успешно",
        description: "Услуга добавлена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить услугу",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const filteredData = {
        ...data,
        includes: data.includes.filter(item => item.trim() !== "")
      };
      return await apiRequest("PUT", `/api/admin/services/${id}`, filteredData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setEditingId(null);
      resetForm();
      toast({
        title: "Успешно",
        description: "Услуга обновлена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить услугу",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Успешно",
        description: "Услуга удалена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить услугу",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      includes: [""],
      targetAudience: "",
      workFormat: "",
      price: "",
      order: "0",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      includes: service.includes.length > 0 ? service.includes : [""],
      targetAudience: service.targetAudience,
      workFormat: service.workFormat,
      price: service.price,
      order: service.order,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleIncludeChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }));
  };

  const addIncludeItem = () => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, ""]
    }));
  };

  const removeIncludeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Управление услугами</CardTitle>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Добавить услугу
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
            <div>
              <Label htmlFor="title">Название услуги</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Название услуги"
                required
              />
            </div>
            
            <div>
              <Label>Что входит в услугу</Label>
              {formData.includes.map((item, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={item}
                    onChange={(e) => handleIncludeChange(index, e.target.value)}
                    placeholder="Пункт услуги"
                  />
                  {formData.includes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIncludeItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIncludeItem}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить пункт
              </Button>
            </div>

            <div>
              <Label htmlFor="targetAudience">Для кого</Label>
              <Textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Целевая аудитория"
                required
              />
            </div>

            <div>
              <Label htmlFor="workFormat">Формат работы</Label>
              <Textarea
                id="workFormat"
                name="workFormat"
                value={formData.workFormat}
                onChange={handleChange}
                placeholder="Формат работы"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Стоимость</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="от 50 000 ₽"
                required
              />
            </div>

            <div>
              <Label htmlFor="order">Порядок</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? "Сохраняем..." : "Сохранить"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Включает:</strong> {service.includes.join(", ")}</p>
                    <p><strong>Для кого:</strong> {service.targetAudience}</p>
                    <p><strong>Формат:</strong> {service.workFormat}</p>
                    <p><strong>Стоимость:</strong> {service.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => deleteMutation.mutate(service.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-center text-gray-500 py-8">Нет добавленных услуг</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
