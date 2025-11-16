import { Router } from 'express';
import { publishCrawlRequest } from '../services/rabbit';
import { getDb } from '../services/mongo';
import { ObjectId } from 'mongodb';


export const router = Router();

router.get('/', (req, res) => {
  res.json([{ id: 1, name: "Example product" }]);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  res.json({ message: "Created", name });
});

router.post('/:id/schedule-crawl', async (req, res, next) => {
  try {
    const id = req.params.id;

    const db = getDb();
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    await publishCrawlRequest(id);

    res.json({ message: 'Crawl scheduled', productId: id });
  } catch (err) {
    next(err);
  }
});

