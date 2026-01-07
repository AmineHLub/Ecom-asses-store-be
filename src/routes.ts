import { Router } from 'express';
import { prisma } from './server';

const router = Router();

router.get('/examples', async (req, res) => {
  const data = await prisma.example.findMany().catch(()=>[]);
  res.json(data);
});

router.post('/examples', async (req, res) => {
  const { name } = req.body;
  const created = await prisma.example.create({
    data: { name }
  });
  res.json(created);
});

export default router;
