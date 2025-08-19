import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import AdminLayout from "@/components/admin/admin-layout";
import ProfileEditor from "@/components/admin/profile-editor";
import CasesManager from "@/components/admin/portfolio-manager";
import ServicesManager from "@/components/admin/services-manager";
import VideoManager from "@/components/admin/video-manager";
import ContactsManager from "@/components/admin/contacts-manager";
import { Lock } from "lucide-react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const { isAuthenticated, login, logout } = useAdmin();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(password);
      toast({
        title: "Успешно",
        description: "Вы вошли в админ-панель",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Неверный пароль",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 items-center">
              <Lock className="h-8 w-8 text-black" />
              <h1 className="text-2xl font-extrabold text-black">Админ-панель</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={logout}>
      <div className="space-y-8">
        <ProfileEditor />
        <VideoManager />
  <CasesManager />
        <ServicesManager />
        <ContactsManager />
      </div>
    </AdminLayout>
  );
}
