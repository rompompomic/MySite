import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerRoutes } from '../server/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let app;

export default async function handler(req, res) {
  if (!app) {
    app = express();
    app.use(express.json({ limit: '25mb' }));
    app.use(express.urlencoded({ extended: false, limit: '25mb' }));
    
    await registerRoutes(app);
    
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
  }
  
  return app(req, res);
}