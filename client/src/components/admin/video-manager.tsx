import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Setting } from "@shared/schema";

export default function VideoManager() {
  const [videoUrl, setVideoUrl] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: videoSetting } = useQuery<Setting>({
    queryKey: ["/api/settings/backgroundVideo"],
  });

  useEffect(() => {
    if (videoSetting) {
      setVideoUrl(videoSetting.value);
    }
  }, [videoSetting]);

  const updateMutation = useMutation({
    mutationFn: async (value: string) => {
      return await apiRequest("PUT", "/api/admin/settings/backgroundVideo", { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/backgroundVideo"] });
      toast({
        title: "Успешно",
        description: "Фоновое видео обновлено",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить видео",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(videoUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление фоновым видео</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="videoUrl">URL видео</Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
            <p className="text-sm text-gray-500 mt-1">
              Оставьте пустым, чтобы показывать только фоновую текстуру
            </p>
          </div>
          
          {videoUrl && (
            <div>
              <Label>Предпросмотр</Label>
              <video 
                src={videoUrl} 
                className="w-full max-w-md h-48 object-cover rounded border"
                controls
                muted
              />
            </div>
          )}
          
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Сохраняем..." : "Сохранить"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
