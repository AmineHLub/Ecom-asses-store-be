import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import routes from './routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

export { app, prisma };
