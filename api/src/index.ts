import express from 'express';
import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './routes/authRoutes.ts';
import { connectToDB } from './server.ts';

const PORT = process.env.PORT || 8080;
const app = express();

connectToDB();

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
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
);

app.listen(PORT, () => {
  console.log('Server started!');
});
