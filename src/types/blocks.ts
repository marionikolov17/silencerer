import { z } from 'zod';

export const BlockSchema = z.object({
  id: z.string(),
  name: z.string(),
  buffer: z.instanceof(ArrayBuffer),
});

export type Block = z.infer<typeof BlockSchema>;
