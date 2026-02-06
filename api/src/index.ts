import express from 'express';
import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.ts';

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
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
);

app.listen(8080, () => {
  console.log('Server started!');
});
