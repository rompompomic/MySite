import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertPortfolioItemSchema, insertServiceSchema, insertSettingSchema, insertContactSchema, insertVideoSchema } from "@shared/schema";
import { z } from "zod";

const adminPasswordSchema = z.object({
  password: z.string(),
});

const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

async function sendToTelegram(data: { name: string; email: string; message: string }) {
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.warn("Telegram bot token or chat ID not configured");
    return;
  }

  const message = `🔔 Новая заявка с сайта\n\n👤 Имя: ${data.name}\n📧 Email: ${data.email}\n💬 Сообщение:\n${data.message}`;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send message to Telegram:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  function requireAuth(req: any, res: any, next: any) {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const providedPassword = req.headers.authorization?.replace('Bearer ', '');
    
    if (providedPassword !== adminPassword) {
      return res.status(401).json({ message: "Неверный пароль" });
    }
    next();
  }

  // Public endpoints
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile || { firstName: "John", lastName: "Wayne", description: "Профессиональный веб-разработчик и дизайнер" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения профиля" });
    }
  });

  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getPortfolioItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения портфолио" });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const serviceList = await storage.getServices();
      res.json(serviceList);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения услуг" });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contactData = await storage.getContacts();
      res.json(contactData || { telegram: "", github: "" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения контактов" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      res.json(setting || { key: req.params.key, value: "" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения настройки" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactFormSchema.parse(req.body);
      await sendToTelegram(data);
      res.json({ message: "Сообщение отправлено" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные формы" });
      } else {
        res.status(500).json({ message: "Ошибка отправки сообщения" });
      }
    }
  });

  // Admin auth
  app.post("/api/admin/auth", async (req, res) => {
    try {
      const { password } = adminPasswordSchema.parse(req.body);
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      
      if (password === adminPassword) {
        res.json({ token: adminPassword });
      } else {
        res.status(401).json({ message: "Неверный пароль" });
      }
    } catch (error) {
      res.status(400).json({ message: "Неверные данные" });
    }
  });

  // Admin endpoints
  app.put("/api/admin/profile", requireAuth, async (req, res) => {
    try {
      const data = insertProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(data);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные профиля" });
      } else {
        res.status(500).json({ message: "Ошибка обновления профиля" });
      }
    }
  });

  app.post("/api/admin/portfolio", requireAuth, async (req, res) => {
    try {
      const data = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(data);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные портфолио" });
      } else {
        res.status(500).json({ message: "Ошибка создания элемента портфолио" });
      }
    }
  });

  app.put("/api/admin/portfolio/:id", requireAuth, async (req, res) => {
    try {
      const data = insertPortfolioItemSchema.partial().parse(req.body);
      const item = await storage.updatePortfolioItem(req.params.id, data);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные портфолио" });
      } else {
        res.status(500).json({ message: "Ошибка обновления элемента портфолио" });
      }
    }
  });

  app.delete("/api/admin/portfolio/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePortfolioItem(req.params.id);
      res.json({ message: "Элемент удален" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка удаления элемента портфолио" });
    }
  });

  app.post("/api/admin/services", requireAuth, async (req, res) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const service = await storage.createService(data);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные услуги" });
      } else {
        res.status(500).json({ message: "Ошибка создания услуги" });
      }
    }
  });

  app.put("/api/admin/services/:id", requireAuth, async (req, res) => {
    try {
      const data = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, data);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные услуги" });
      } else {
        res.status(500).json({ message: "Ошибка обновления услуги" });
      }
    }
  });

  app.delete("/api/admin/services/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.json({ message: "Услуга удалена" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка удаления услуги" });
    }
  });

  app.put("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const contact = await storage.updateContacts(data);
      res.json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные контактов" });
      } else {
        res.status(500).json({ message: "Ошибка обновления контактов" });
      }
    }
  });

  app.put("/api/admin/settings/:key", requireAuth, async (req, res) => {
    try {
      const data = insertSettingSchema.parse({ key: req.params.key, value: req.body.value });
      const setting = await storage.updateSetting(data);
      res.json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные настройки" });
      } else {
        res.status(500).json({ message: "Ошибка обновления настройки" });
      }
    }
  });

  // Video endpoints
  app.get("/api/background-video", async (req, res) => {
    try {
      const video = await storage.getBackgroundVideo();
      if (video) {
        res.set('Content-Type', video.mimeType);
        res.set('Cache-Control', 'public, max-age=3600'); // Кэшируем на 1 час
        res.set('Content-Length', Buffer.byteLength(video.data, 'base64').toString());
        
        const buffer = Buffer.from(video.data, 'base64');
        res.send(buffer);
      } else {
        res.status(404).json({ message: "Видео не найдено" });
      }
    } catch (error) {
      console.error("Video fetch error:", error);
      res.status(500).json({ message: "Ошибка получения видео" });
    }
  });

  app.post("/api/admin/upload-video", requireAuth, async (req, res) => {
    try {
      console.log("Upload request received, body size:", JSON.stringify(req.body).length);
      
      const data = insertVideoSchema.parse(req.body);
      console.log("Schema validation passed");
      
      const video = await storage.createVideo(data);
      console.log("Video created in storage");
      
      await storage.updateBackgroundVideo(video.id);
      console.log("Background video updated");
      
      res.json({ message: "Видео загружено", video: { id: video.id, filename: video.filename } });
    } catch (error) {
      console.error("Video upload error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Неверные данные видео", errors: error.errors });
      } else {
        res.status(500).json({ message: "Ошибка загрузки видео", error: error.message });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
