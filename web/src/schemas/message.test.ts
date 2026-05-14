import { describe, expect, it } from 'vitest';
import { messageSchema, MESSAGE_CONTENT_MAX } from './message';
import { SchemaMessageTypes } from './schema-message';

function future(offsetMs: number): string {
  return new Date(Date.now() + offsetMs).toISOString().slice(0, 16);
}

describe('messageSchema', () => {
  it('exige pelo menos um contato', () => {
    const result = messageSchema.safeParse({
      content: 'oi',
      contactIds: [],
      schedule: false,
      scheduledFor: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === SchemaMessageTypes.MIN_ONE_CONTACT),
      ).toBe(true);
    }
  });

  it('rejeita conteúdo acima do limite', () => {
    const result = messageSchema.safeParse({
      content: 'x'.repeat(MESSAGE_CONTENT_MAX + 1),
      contactIds: ['a'],
      schedule: false,
      scheduledFor: '',
    });
    expect(result.success).toBe(false);
  });

  it('exige data ao agendar', () => {
    const result = messageSchema.safeParse({
      content: 'oi',
      contactIds: ['a'],
      schedule: true,
      scheduledFor: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('scheduledFor');
    }
  });

  it('rejeita data no passado ao agendar', () => {
    const result = messageSchema.safeParse({
      content: 'oi',
      contactIds: ['a'],
      schedule: true,
      scheduledFor: '2000-01-01T10:00',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(SchemaMessageTypes.INVALID_FUTURE_DATE);
    }
  });

  it('aceita envio imediato válido', () => {
    const result = messageSchema.safeParse({
      content: 'oi',
      contactIds: ['a'],
      schedule: false,
      scheduledFor: '',
    });
    expect(result.success).toBe(true);
  });

  it('aceita agendamento futuro válido', () => {
    const result = messageSchema.safeParse({
      content: 'oi',
      contactIds: ['a'],
      schedule: true,
      scheduledFor: future(60 * 60 * 1000),
    });
    expect(result.success).toBe(true);
  });
});
