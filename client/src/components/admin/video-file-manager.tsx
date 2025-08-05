import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Upload, Play, Trash2, Check } from "lucide-react";
import type { VideoFile } from "@shared/schema";

export default function VideoFileManager() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: videos = [] } = useQuery<VideoFile[]>({
    queryKey: ["/api/videos"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('video', file);
      return apiRequest('/api/admin/videos/upload', 'POST', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos/active"] });
      setSelectedFile(null);
      toast({
        title: "Успешно",
        description: "Видео файл загружен",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить видео файл",
        variant: "destructive",
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/videos/${id}/activate`, 'PUT');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos/active"] });
      toast({
        title: "Успешно",
        description: "Видео активировано",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось активировать видео",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/videos/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos/active"] });
      toast({
        title: "Успешно",
        description: "Видео файл удален",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить видео файл",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите видео файл",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Управление фоновым видео
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="video-upload">Загрузить новое видео</Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="mt-1"
            />
          </div>
          
          {selectedFile && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Выбран файл: {selectedFile.name} ({formatFileSize(selectedFile.size.toString())})
              </span>
              <Button 
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                size="sm"
              >
                {uploadMutation.isPending ? "Загружается..." : "Загрузить"}
              </Button>
            </div>
          )}
        </div>

        {/* Videos List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Загруженные видео</h3>
          
          {videos.length === 0 ? (
            <p className="text-gray-500">Нет загруженных видео файлов</p>
          ) : (
            <div className="grid gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{video.originalName}</span>
                      {video.isActive && (
                        <Badge variant="default">Активное</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 space-x-4">
                      <span>{formatFileSize(video.fileSize)}</span>
                      <span>{video.mimeType}</span>
                      <span>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Неизвестно'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!video.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => activateMutation.mutate(video.id)}
                        disabled={activateMutation.isPending}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(video.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
