import mongoose from 'mongoose';
import 'dotenv/config';

export async function connectToDB() {
  try {
    if (typeof process.env.DATABASE_URL != 'undefined')
      await mongoose.connect(process.env.DATABASE_URL);
    else throw new Error('MongoDB connection error');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
