import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import {
  fetchEnglishProblems,
  fetchMathProblems,
} from '../controllers/app.controller.js';

const router = express.Router();

router.get('/math', authenticateUser, fetchMathProblems);
router.get('/english', authenticateUser, fetchEnglishProblems);

export default router;
