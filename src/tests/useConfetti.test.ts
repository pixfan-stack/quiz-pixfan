import { afterEach, describe, expect, it } from 'vitest';
import { prefersReducedMotion, useConfetti } from '../hooks/useConfetti';
import { renderHook, act } from '@testing-library/react';

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? matches : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('useConfetti', () => {
  afterEach(() => {
    stubMatchMedia(false);
  });

  it('starts with isAnimating false', () => {
    const { result } = renderHook(() => useConfetti());
    expect(result.current.isAnimating).toBe(false);
  });

  it('fires confetti and starts animation', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useConfetti());
    act(() => {
      result.current.fire(50);
    });
    expect(result.current.isAnimating).toBe(true);
  });

  it('fires with default count', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useConfetti());
    act(() => {
      result.current.fire();
    });
    expect(result.current.isAnimating).toBe(true);
  });

  it('prefersReducedMotion reads the media query', () => {
    stubMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
    stubMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it('does not animate when prefers-reduced-motion is set', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useConfetti());
    act(() => {
      result.current.fire(80);
    });
    expect(result.current.isAnimating).toBe(false);
  });
});
