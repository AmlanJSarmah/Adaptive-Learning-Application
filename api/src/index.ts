import express from 'express';
import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
// CORS
import cors from 'cors';
// ENV
import 'dotenv/config';
import './config/env.js';
import { env } from './config/env.js';
// DB
import { connectToDB } from './config/db.js';
// Routes
import authRouter from './routes/auth.routes.js';
//Error handling
import { treeifyError, ZodError } from 'zod';
import { AppError } from './utils/error.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/user', authRouter);

app.use(
  (
    error: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: treeifyError(error),
      });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
);

(async () => {
  await connectToDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on ${env.PORT}`);
  });
})();
