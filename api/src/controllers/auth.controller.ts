import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  userSignUpSchema,
  userSignInSchema,
  authHeaderSchema,
} from '../schemas/auth.schema.js';
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

export const handleUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqBodyParsed = userSignInSchema.parse(req.body);
    const user = await userModel.findOne({ name: reqBodyParsed.name });
    if (user && (await bcrypt.compare(reqBodyParsed.password, user.password))) {
      const token = jwt.sign(
        {
          userName: reqBodyParsed.name,
        },
        env.JWT_SECRET,
        { expiresIn: '1hr' }
      );
      res
        .status(200)
        .json({ message: 'User Logged in Successful', token: token });
    } else throw new AppError(401, "User doesn't exist");
  } catch (err) {
    next(err);
  }
};
