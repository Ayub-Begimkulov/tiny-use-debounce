import { AnyFunction, createDebounceHook } from ".";
import { renderHook } from "@testing-library/react-hooks";

function debounce<T extends AnyFunction>(cb: T, wait: number) {
  let timeoutId: number | null = null;
  return function (...args: Parameters<T>) {
    if (typeof timeoutId === "number") clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      cb(...args);
    }, wait);
  };
}

jest.useFakeTimers();

describe("useDebounce", () => {
  it("basic", () => {
    const useDebounce = createDebounceHook(debounce);
    const mock = jest.fn();
    const { result } = renderHook(() => useDebounce(mock, 100));
    expect(typeof result.current).toBe("function");
    expect(mock).not.toBeCalled();
    result.current();
    expect(mock).not.toBeCalled();
    jest.advanceTimersByTime(100);
    expect(mock).toBeCalledTimes(1);
  });

  it("should return the same reference to a function", () => {
    const useDebounce = createDebounceHook(debounce);
    const { result, rerender } = renderHook(fn => useDebounce(fn, 100), {
      initialProps: () => {},
    });
    let currentResult = result.current;
    rerender(() => {});
    expect(result.current).toBe(currentResult);
  });

  it.skip("returned function should hold latest values in the closure", () => {
    const useDebounce = createDebounceHook(debounce);
    const { result, rerender } = renderHook(
      fn => {
        return useDebounce(fn, 100);
      },
      {
        initialProps: () => {},
      }
    );
    let currentResult = result.current;
    rerender(() => {});
    expect(result.current).toBe(currentResult);
  });
  it.todo("should batch updates");
  it.todo("");
});
