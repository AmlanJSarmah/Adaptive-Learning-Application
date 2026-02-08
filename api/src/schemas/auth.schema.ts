import { z } from 'zod';

export const userSignUpSchema = z.object({
  name: z.string(),
  studentClass: z.number().int().positive(),
  password: z.string(),
});

export const userSignInSchema = z.object({
  name: z.string(),
  password: z.string(),
});

export const authHeaderSchema = z
  .string()
  .regex(/^Bearer\s.+$/, 'Invalid Authorization header');
