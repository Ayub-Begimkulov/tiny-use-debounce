import { useReducer } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useDebounce, useThrottle } from "..";

jest.useFakeTimers();

describe.each([useDebounce, useThrottle])("createDebounceHook", useDebounce => {
  it("basic", () => {
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
    const { result, rerender } = renderHook(fn => useDebounce(fn, 100), {
      initialProps: () => {},
    });
    let currentResult = result.current;
    rerender(() => {});
    expect(result.current).toBe(currentResult);
  });

  it("should hold latest values in the closure", () => {
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

  it("should update if debounce arguments aren't referentially equal", () => {
    const fn = () => {};
    const { result, rerender } = renderHook(
      ({ wait }) => useDebounce(fn, wait),
      {
        initialProps: { wait: 100 },
      }
    );
    let currentResult = result.current;
    rerender({ wait: 101 });
    expect(result.current).not.toBe(currentResult);
  });

  // TODO how to test that hook batches updates?
  // If I use `act` it batches them without `unstable_batchedUpdates`
  // if I doesn't do it, `unstable_batchedUpdates` doesn't seem to work
  it.skip("should batch updates", () => {
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
