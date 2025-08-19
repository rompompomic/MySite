import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Default to 5000 if not specified.
  const port = parseInt(process.env.PORT || '5000', 10);

  // Helper to await server.listen by listening for 'listening' and 'error' events
  const tryListen = (opts: any) => {
    return new Promise<void>((resolve, reject) => {
      const onError = (err: any) => {
        cleanup();
        reject(err);
      };
      const onListening = () => {
        cleanup();
        resolve();
      };
      function cleanup() {
        server.off('error', onError);
        server.off('listening', onListening);
      }

      server.once('error', onError);
      server.once('listening', onListening);
      // use the callback-less form so errors are emitted as events we can catch
      server.listen(opts);
    });
  };

  // Try the intended listen options first (useful in many environments).
  // On platforms like Windows where `reusePort` or binding to 0.0.0.0 may be unsupported
  // we'll catch the error and retry on localhost without reusePort.
  try {
    await tryListen({ port, host: '0.0.0.0', reusePort: true });
    log(`serving on port ${port}`);
  } catch (err: any) {
    log(`listen failed on 0.0.0.0:${port} -> ${err && err.code ? err.code : err}`);
    log('Retrying on 127.0.0.1 without reusePort...');
    try {
      await tryListen({ port, host: '127.0.0.1' });
      log(`serving on port ${port} (127.0.0.1)`);
    } catch (err2: any) {
      console.error('Failed to start server:', err2);
      process.exit(1);
    }
  }
})();
