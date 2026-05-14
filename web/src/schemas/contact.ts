import { z } from 'zod';
import { unmaskPhone } from '../lib/phone';
import { SchemaMessageTypes } from './schema-message';

export const contactSchema = z.object({
  name: z.string().trim().min(1, SchemaMessageTypes.REQUIRED_FIELD),
  phone: z
    .string()
    .min(1, SchemaMessageTypes.REQUIRED_FIELD)
    .refine(
      (value) => {
        const digits = unmaskPhone(value);
        return digits.length >= 10 && digits.length <= 11;
      },
      { message: SchemaMessageTypes.INVALID_PHONE },
    ),
});

export type ContactInput = z.infer<typeof contactSchema>;
