import { z } from 'zod';

export const userSignUpSchema = z.object({
  name: z.string(),
  studentClass: z.number().int().positive(),
  password: z.string(),
});
