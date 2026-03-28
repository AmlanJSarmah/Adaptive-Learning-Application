import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import {
  fetchEnglishProblems,
  fetchMathProblems,
  getResults,
} from '../controllers/app.controller.js';

const router = express.Router();

router.get('/math', authenticateUser, fetchMathProblems);
router.get('/english', authenticateUser, fetchEnglishProblems);
router.post('/results', authenticateUser, getResults);

export default router;
