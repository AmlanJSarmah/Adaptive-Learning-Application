import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.ts';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/user', authRouter);

app.listen(8080, () => {
  console.log('Server started!');
});
