import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import routes from './routes';
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'

dotenv.config();

const securityWOW = true

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

if (securityWOW) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app, prisma };
