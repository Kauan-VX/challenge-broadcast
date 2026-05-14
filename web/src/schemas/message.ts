import { z } from 'zod';
import { SchemaMessageTypes } from './schema-message';

export const MESSAGE_CONTENT_MAX = 1000;

export const messageSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, SchemaMessageTypes.REQUIRED_FIELD)
      .max(MESSAGE_CONTENT_MAX, SchemaMessageTypes.MAX_CARACTERS(MESSAGE_CONTENT_MAX)),
    contactIds: z
      .array(z.string())
      .min(1, SchemaMessageTypes.MIN_ONE_CONTACT),
    schedule: z.boolean(),
    scheduledFor: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.schedule) return;

    if (!data.scheduledFor) {
      ctx.addIssue({
        code: 'custom',
        path: ['scheduledFor'],
        message: SchemaMessageTypes.REQUIRED_FIELD,
      });
      return;
    }

    const date = new Date(data.scheduledFor);
    if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) {
      ctx.addIssue({
        code: 'custom',
        path: ['scheduledFor'],
        message: SchemaMessageTypes.INVALID_FUTURE_DATE,
      });
    }
  });

export type MessageInput = z.infer<typeof messageSchema>;
