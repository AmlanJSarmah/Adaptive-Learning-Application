import mongoose, { Schema } from 'mongoose';

interface IUser extends mongoose.Document {
  name: string;
  studentClass: number;
  password: string;
  correctness: number[];
  timeTakenPerQuestion: number[];
  attemptsPerQuestion: number[];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  studentClass: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  correctness: {
    type: [{ type: Number }],
  },
  timeTakenPerQuestion: {
    type: [{ type: Number }],
  },
  attemptsPerQuestion: {
    type: [{ type: Number }],
  },
});

const User = mongoose.model<IUser>('User', userSchema, 'users');
export default User;
