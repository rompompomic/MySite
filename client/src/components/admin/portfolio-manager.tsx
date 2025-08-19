import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";

export default function PortfolioManager() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    order: "0",
    hasLink: false,
    linkUrl: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolioItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
  return await apiRequest("POST", "/api/admin/portfolio", data);
    },
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsAdding(false);
      setFormData({ title: "", description: "", imageUrl: "", order: "0", hasLink: false, linkUrl: "" });
      toast({
        title: "Успешно",
        description: "Работа добавлена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить работу",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
  return await apiRequest("PUT", `/api/admin/portfolio/${id}`, data);
    },
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setEditingId(null);
      setFormData({ title: "", description: "", imageUrl: "", order: "0", hasLink: false, linkUrl: "" });
      toast({
        title: "Успешно",
        description: "Работа обновлена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить работу",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
  return await apiRequest("DELETE", `/api/admin/portfolio/${id}`);
    },
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Успешно",
        description: "Работа удалена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить работу",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      order: item.order,
      hasLink: item.hasLink || false,
      linkUrl: item.linkUrl || "",
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", description: "", imageUrl: "", order: "0", hasLink: false, linkUrl: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasLink: checked,
      linkUrl: checked ? prev.linkUrl : "",
    }));
  };

  return (
    <Card>
    <CardHeader>
        <div className="flex justify-between items-center">
      <CardTitle>Управление портфолио</CardTitle>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Добавить работу
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
            <div>
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Название работы"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Описание работы"
                required
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">URL изображения</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
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
            <div className="flex items-center space-x-2">
              <Switch
                id="hasLink"
                checked={formData.hasLink}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="hasLink">Добавить ссылку</Label>
            </div>
            {formData.hasLink && (
              <div>
                <Label htmlFor="linkUrl">URL ссылки</Label>
                <Input
                  id="linkUrl"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  required={formData.hasLink}
                />
              </div>
            )}
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
          {portfolioItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {portfolioItems.length === 0 && (
            <p className="text-center text-gray-500 py-8">Нет добавленных работ</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
