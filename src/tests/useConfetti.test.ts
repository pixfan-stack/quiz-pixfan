import { describe, it, expect } from 'vitest';
import { useConfetti } from '../hooks/useConfetti';
import { renderHook, act } from '@testing-library/react';

describe('useConfetti', () => {
  it('starts with isAnimating false', () => {
    const { result } = renderHook(() => useConfetti());
    expect(result.current.isAnimating).toBe(false);
  });

  it('fires confetti and starts animation', () => {
    const { result } = renderHook(() => useConfetti());
    act(() => { result.current.fire(50); });
    expect(result.current.isAnimating).toBe(true);
  });

  it('fires with default count', () => {
    const { result } = renderHook(() => useConfetti());
    act(() => { result.current.fire(); });
    expect(result.current.isAnimating).toBe(true);
  });
});
