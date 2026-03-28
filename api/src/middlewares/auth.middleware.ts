import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authHeaderSchema, jwtVerifySchema } from '../schemas/user.schema.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/error.js';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = authHeaderSchema.parse(req.headers.authorization);
  const token = authHeaderSchema.parse(headers.split(' ')[1]);
  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET);
    const user = jwtVerifySchema.parse(decodedToken);
    req.authenticatedUser = {
      isAuthenticated: true,
      name: user.userName,
      studentClass: user.studentClass,
    };
    next();
  } catch (err) {
    next(new AppError(401, 'Unauthorized'));
  }
};
