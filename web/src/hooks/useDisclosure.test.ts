import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDisclosure } from './useDisclosure';

describe('useDisclosure', () => {
  it('inicia fechado por padrão', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.open).toBe(false);
  });

  it('respeita estado inicial customizado', () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.open).toBe(true);
  });

  it('abre, fecha e alterna', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current.onOpen());
    expect(result.current.open).toBe(true);

    act(() => result.current.onClose());
    expect(result.current.open).toBe(false);

    act(() => result.current.onToggle());
    expect(result.current.open).toBe(true);
  });
});
