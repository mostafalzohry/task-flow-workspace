import { act, renderHook } from "@testing-library/react";

import { useDebouncedValue } from "./use-debounced-value";

describe("useDebouncedValue", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("a", 300));
    expect(result.current).toBe("a");
  });

  it("only updates after the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe("ab");
  });

  it("restarts the timer on rapid changes so only the last value lands", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    act(() => jest.advanceTimersByTime(200));
    rerender({ value: "abc" });
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe("abc");
  });
});
