import { describe, expect, it } from 'vitest';
import { contactSchema } from './contact';
import { SchemaMessageTypes } from './schema-message';

describe('contactSchema', () => {
  it('aceita nome e telefone válidos', () => {
    const result = contactSchema.safeParse({
      name: 'João Silva',
      phone: '(11) 99999-0000',
    });
    expect(result.success).toBe(true);
  });

  it('exige nome', () => {
    const result = contactSchema.safeParse({ name: '   ', phone: '(11) 99999-0000' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(SchemaMessageTypes.REQUIRED_FIELD);
    }
  });

  it('rejeita telefone sem DDD', () => {
    const result = contactSchema.safeParse({ name: 'João', phone: '99999' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(SchemaMessageTypes.INVALID_PHONE);
    }
  });
});
