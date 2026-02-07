import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectToDB() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log('Connected to DB...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
