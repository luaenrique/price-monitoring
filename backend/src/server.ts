import express from 'express';
import cors from 'cors';
import { connectMongo } from './services/mongo';
import { router as healthRouter } from './routes/health';
import { router as productsRouter } from './routes/products';
import { connectRabbit } from './services/rabbit';

export async function createServer() {
  await connectMongo(); // making sure Mongo is connected before handling requests
  await connectRabbit();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/products', productsRouter);

  // global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'internal error' });
  });

  return app;
}
