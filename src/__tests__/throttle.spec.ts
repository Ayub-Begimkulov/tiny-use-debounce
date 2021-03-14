import { throttle } from "../debounce";

jest.useFakeTimers("modern");

describe("throttle", () => {
  it("should call function after timeout", () => {
    const mock = jest.fn();
    const throttledMock = throttle(mock, 100);

    throttledMock();
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);

    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);

    expect(mock).toBeCalledTimes(1);
  });

  it("should not call function more often than timeout", () => {
    const mock = jest.fn();
    const throttledMock = throttle(mock, 100);

    throttledMock();
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);
    throttledMock();
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(mock).toBeCalledTimes(1);

    throttledMock();

    jest.advanceTimersByTime(50);
    throttledMock();
    expect(mock).toBeCalledTimes(1);

    jest.advanceTimersByTime(50);

    expect(mock).toBeCalledTimes(2);
  });

  it("cancel", () => {
    const mock = jest.fn();
    const throttledMock = throttle(mock, 100);
    // should not do anything
    throttledMock.cancel();

    throttledMock();
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(mock).not.toBeCalled();
    throttledMock.cancel();

    expect(mock).not.toBeCalled();

    // should work as usual after cancel
    throttledMock();
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(mock).toBeCalled();
  });
});
