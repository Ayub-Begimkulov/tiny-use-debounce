import { debounce } from "../debounce";

jest.useFakeTimers("modern");

describe("debounce", () => {
  it("should call function after timeout", () => {
    const func = jest.fn();
    const debouncedFunction = debounce(func, 100);

    debouncedFunction();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).toBeCalledTimes(1);
  });

  it("should reset timer when function is called", () => {
    const func = jest.fn();
    const debouncedFunction = debounce(func, 100);

    debouncedFunction();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);

    debouncedFunction();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    // the timer was reset, shouldn't be called
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(100);
    // 100ms passed after last call, function should be called
    expect(func).toBeCalledTimes(1);
  });

  it("should properly debounce function with leading set to true ", () => {
    const func = jest.fn();
    const debouncedFunction = debounce(func, 100, { leading: true });

    debouncedFunction();
    expect(func).toBeCalledTimes(1);
    expect(func).toBeCalledTimes(1);

    jest.advanceTimersByTime(50);
    expect(func).toBeCalledTimes(1);
    // should not be called immediately
    debouncedFunction();
    expect(func).toBeCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(func).toBeCalledTimes(2);

    // it should be possible to call it second time after timeout passes
    debouncedFunction();
    expect(func).toBeCalledTimes(3);
  });

  it("should cancels debounced function ", () => {
    const func = jest.fn();
    const debouncedFunction = debounce(func, 100);

    debouncedFunction();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    debouncedFunction.cancel();

    jest.advanceTimersByTime(50);
    expect(func).not.toBeCalled();
  });

  it.todo("cancel");
  it.todo("cancel + trailing");

  describe("maxWait", () => {
    it("should call func with maxWait >= wait correctly", () => {
      const func = jest.fn();
      const debouncedFunction = debounce(func, 100, { maxWait: 150 });
      debouncedFunction();

      jest.advanceTimersByTime(80);
      expect(func).not.toBeCalled();
      debouncedFunction();

      // function should be called because of maxWait
      jest.advanceTimersByTime(71);
      expect(func).toBeCalledTimes(1);
    });

    it("should call func with maxWait < wait correctly", () => {
      const func = jest.fn();
      const debouncedFunction = debounce(func, 100, { maxWait: 50 });
      debouncedFunction();

      // function should be called because of maxWait
      jest.advanceTimersByTime(50);
      expect(func).toBeCalledTimes(1);

      jest.advanceTimersByTime(50);
      expect(func).toBeCalledTimes(1);

      debouncedFunction();
      jest.advanceTimersByTime(50);
      expect(func).toBeCalledTimes(2);
    });

    it("should call in the next tick with maxWait === 0", () => {
      const func = jest.fn();
      const debouncedFunction = debounce(func, 100, { maxWait: 0 });
      debouncedFunction();
      expect(func).not.toBeCalled();

      jest.advanceTimersByTime(1);
      expect(func).toBeCalledTimes(1);
    });
  });
});
