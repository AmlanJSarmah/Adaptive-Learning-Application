import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
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

const user = new mongoose.Model('users', userSchema);
export default user;
