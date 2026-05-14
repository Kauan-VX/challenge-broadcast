import { z } from 'zod';
import { SchemaMessageTypes } from './schema-message';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, SchemaMessageTypes.REQUIRED_FIELD)
    .email(SchemaMessageTypes.INVALID_EMAIL),
  password: z.string().min(1, SchemaMessageTypes.REQUIRED_FIELD),
});

export type LoginInput = z.infer<typeof loginSchema>;
