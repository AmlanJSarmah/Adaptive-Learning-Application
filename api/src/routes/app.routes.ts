import express from 'express';
import { Request, Response } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/math', authenticateUser, (req: Request, res: Response) => {
  console.log(req?.authenticatedUser);
  res.status(200).json({});
});

export default router;
