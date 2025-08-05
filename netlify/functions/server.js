const serverlessHttp = require('serverless-http');
const express = require('express');

let cachedHandler;

// Simplified storage for Netlify (using environment variables)
const storage = {
  async getProfile() {
    return {
      id: 1,
      firstName: process.env.PROFILE_FIRST_NAME || "Данил",
      lastName: process.env.PROFILE_LAST_NAME || "Ушаков", 
      description: process.env.PROFILE_DESCRIPTION || "Профессиональный веб-разработчик и дизайнер с опытом создания современных цифровых решений."
    };
  },
  
  async getPortfolioItems() {
    // Для Netlify используем переменные окружения для простоты
    const items = JSON.parse(process.env.PORTFOLIO_ITEMS || '[]');
    return items;
  },
  
  async getServices() {
    const services = JSON.parse(process.env.SERVICES_LIST || '[]');
    return services;
  },
  
  async getContacts() {
    return {
      id: 1,
      telegram: process.env.TELEGRAM_CONTACT || "https://t.me/danilusha",
      github: process.env.GITHUB_CONTACT || "https://github.com/danilusha"
    };
  },
  
  async getSetting(key) {
    return {
      key: key,
      value: process.env[`SETTING_${key.toUpperCase()}`] || ""
    };
  },
  
  async getActiveVideoFile() {
    return {
      id: "default-video",
      fileName: "background-video.mp4",
      filePath: process.env.BACKGROUND_VIDEO_URL || "",
      isActive: true
    };
  }
};

async function sendToTelegram(data) {
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

const createHandler = async () => {
  if (cachedHandler) return cachedHandler;

  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add CORS headers for Netlify
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Auth middleware
  function requireAuth(req, res, next) {
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
      res.json(profile);
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
      res.json(contactData);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения контактов" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения настройки" });
    }
  });

  app.get("/api/videos/active", async (req, res) => {
    try {
      const activeVideo = await storage.getActiveVideoFile();
      res.json(activeVideo);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения активного видео" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Все поля обязательны" });
      }
      
      await sendToTelegram({ name, email, message });
      res.json({ message: "Сообщение отправлено" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка отправки сообщения" });
    }
  });

  // Admin auth
  app.post("/api/admin/auth", async (req, res) => {
    try {
      const { password } = req.body;
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

  cachedHandler = serverlessHttp(app);
  return cachedHandler;
};

// Export the serverless function
exports.handler = async (event, context) => {
  const serverlessHandler = await createHandler();
  return serverlessHandler(event, context);
};

