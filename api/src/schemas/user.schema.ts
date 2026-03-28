import { z } from 'zod';

export const authHeaderSchema = z.string();

export const jwtVerifySchema = z.object({
  userName: z.string(),
  studentClass: z.coerce.number(),
});
