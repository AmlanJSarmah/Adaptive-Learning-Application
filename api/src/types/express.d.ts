import type { z } from 'zod';
import type { jwtVerifySchema } from '../schemas/user.schema';
declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: z.infer<typeof jwtVerifySchema>;
    }
  }
}
export {};
