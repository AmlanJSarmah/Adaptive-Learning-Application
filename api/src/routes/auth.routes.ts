import express from 'express';
import { handleUserSignup } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup', handleUserSignup);

export default router;
