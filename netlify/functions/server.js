import serverlessHttp from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../../server/routes.js';

let cachedHandler;

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

  // Register routes
  await registerRoutes(app);

  cachedHandler = serverlessHttp(app);
  return cachedHandler;
};

// Export the serverless function
export const handler = async (event, context) => {
  const serverlessHandler = await createHandler();
  return serverlessHandler(event, context);
};
