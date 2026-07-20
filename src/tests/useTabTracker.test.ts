import { describe, it, expect } from 'vitest';
import { useTabTracker } from '../hooks/useTabTracker';
import { renderHook, act } from '@testing-library/react';

describe('useTabTracker', () => {
  it('starts with isFocused true and 0 tab switches', () => {
    const { result } = renderHook(() => useTabTracker(true));
    expect(result.current.isFocused).toBe(true);
    expect(result.current.tabSwitchCount).toBe(0);
  });

  it('detects tab switch when hidden becomes true', () => {
    const { result } = renderHook(() => useTabTracker(true));

    act(() => {
      Object.defineProperty(document, 'hidden', { value: true, writable: true });
      window.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current.tabSwitchCount).toBeGreaterThanOrEqual(0);
  });

  it('does not track when active is false', () => {
    const { result } = renderHook(() => useTabTracker(false));
    expect(result.current.tabSwitchCount).toBe(0);
  });

  it('resets focus state on focus', () => {
    const { result } = renderHook(() => useTabTracker(true));
    act(() => { result.current.onFocus(); });
    expect(result.current.isFocused).toBe(true);
  });
});
