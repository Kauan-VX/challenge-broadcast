import { z } from 'zod';
import { SchemaMessageTypes } from './schema-message';

export const connectionSchema = z.object({
  name: z.string().trim().min(1, SchemaMessageTypes.REQUIRED_FIELD),
});

export type ConnectionInput = z.infer<typeof connectionSchema>;
