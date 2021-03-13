import { useReducer } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { createDebounceHook } from "..";
import { AnyFunction } from "src/create-debounce-hook";

function debounce<T extends AnyFunction>(cb: T, wait: number) {
  let timeoutId: number | null = null;
  return function (...args: Parameters<T>) {
    if (typeof timeoutId === "number") clearTimeout(timeoutId);
    timeoutId = (setTimeout as typeof window.setTimeout)(() => {
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

  it("should hold latest values in the closure", () => {
    const useDebounce = createDebounceHook(debounce);
    const mock = jest.fn();
    let renderCount = 0;
    const { result, rerender } = renderHook(() => {
      renderCount++;
      return useDebounce(() => {
        mock(renderCount);
      }, 100);
    });

    result.current();
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(100);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith(1);

    rerender();

    result.current();

    jest.advanceTimersByTime(100);
    expect(mock).toBeCalledTimes(2);
    expect(mock).toBeCalledWith(2);

    rerender();
    rerender();

    result.current();

    jest.advanceTimersByTime(100);
    expect(mock).toBeCalledTimes(3);
    expect(mock).toBeCalledWith(4);
  });

  // TODO how to test that hook batches updates?
  // If I use `act` it batches them without `unstable_batchedUpdates`
  // if I doesn't do it, `unstable_batchedUpdates` doesn't seem to work
  it.skip("should batch updates", () => {
    const useDebounce = createDebounceHook(debounce);
    const mock = jest.fn();
    let renderCount = 0;
    const { result } = renderHook(
      mock => {
        renderCount++;
        const [, forceUpdate] = useReducer(x => x + 1, 0);
        return useDebounce(() => {
          mock();
          forceUpdate();
          forceUpdate();
        }, 100);
      },
      { initialProps: mock }
    );
    expect(typeof result.current).toBe("function");
    expect(renderCount).toBe(1);
    expect(mock).not.toBeCalled();

    result.current();
    expect(mock).not.toBeCalled();
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(renderCount).toBe(2);
    expect(mock).toBeCalledTimes(1);
  });
});
