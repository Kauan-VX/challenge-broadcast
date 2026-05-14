import { z } from 'zod';
import { SchemaMessageTypes } from './schema-message';

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, SchemaMessageTypes.REQUIRED_FIELD)
    .email(SchemaMessageTypes.INVALID_EMAIL),
  password: z.string().min(6, SchemaMessageTypes.MIN_CARACTERS(6)),
});

export type SignupInput = z.infer<typeof signupSchema>;
