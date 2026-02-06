import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router();

router.use('/signup', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Sign up successful' });
});

export default router;
