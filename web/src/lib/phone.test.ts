import { describe, expect, it } from 'vitest';
import { formatPhone, isValidPhone, unmaskPhone } from './phone';

describe('formatPhone', () => {
  it('retorna string vazia quando não há dígitos', () => {
    expect(formatPhone('')).toBe('');
    expect(formatPhone('abc')).toBe('');
  });

  it('formata número com 11 dígitos no padrão celular', () => {
    expect(formatPhone('11999990000')).toBe('(11) 99999-0000');
  });

  it('formata número com 10 dígitos no padrão fixo', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('ignora caracteres não numéricos na entrada', () => {
    expect(formatPhone('(11) 99999-0000')).toBe('(11) 99999-0000');
    expect(formatPhone('11 99999 0000')).toBe('(11) 99999-0000');
  });

  it('trunca quando excede 11 dígitos', () => {
    expect(formatPhone('1199999000012345')).toBe('(11) 99999-0000');
  });
});

describe('unmaskPhone', () => {
  it('remove tudo que não é dígito', () => {
    expect(unmaskPhone('(11) 99999-0000')).toBe('11999990000');
  });
});

describe('isValidPhone', () => {
  it('aceita 10 e 11 dígitos', () => {
    expect(isValidPhone('(11) 3333-4444')).toBe(true);
    expect(isValidPhone('(11) 99999-0000')).toBe(true);
  });

  it('rejeita números curtos ou longos demais', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('123456789012')).toBe(false);
  });
});
