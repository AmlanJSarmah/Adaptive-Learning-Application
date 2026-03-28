import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string().min(5),
  PASSWORD_SALT: z.coerce.number(),
  JWT_SECRET: z.string().min(5),
  OPEN_AI_API_KEY: z.string().min(5),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid env vars');
  process.exit(1);
} else {
  console.log('Parsed env successfully');
}

export const env = parsed.data;
