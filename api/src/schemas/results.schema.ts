import { z } from 'zod';

export const resultsSchema = z.object({
  correctness: z.array(z.number()).length(5),
  time_taken: z.array(z.number()).length(5),
  attempts: z.array(z.number()).length(5),
});
