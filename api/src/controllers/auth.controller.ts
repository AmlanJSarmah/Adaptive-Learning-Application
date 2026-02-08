import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { userSignUpSchema } from '../schemas/auth.schema.js';
import userModel from '../models/user.model.js';
import { AppError } from '../utils/error.js';
import { env } from '../config/env.js';

export const handleUserSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqBodyParsed = userSignUpSchema.parse(req.body);
    if (!(await userModel.findOne({ name: reqBodyParsed.name }))) {
      reqBodyParsed.password = await bcrypt.hash(
        reqBodyParsed.password,
        env.PASSWORD_SALT
      );
      await userModel.create(reqBodyParsed);
      res.status(200).json({ message: 'User Signed up successfully' });
    } else {
      throw new AppError(409, 'User Already Exist');
    }
  } catch (error) {
    next(error);
  }
};
