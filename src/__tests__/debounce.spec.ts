import { debounce } from "../debounce";

jest.useFakeTimers("modern");

describe("debounce", () => {
  it("should call function after timeout", () => {
    const mock = jest.fn();
    const debouncedMock = debounce(mock, 100);

    debouncedMock();

    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);

    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);

    expect(mock).toBeCalledTimes(1);
  });

  it("should reset timer on call", () => {
    const mock = jest.fn();
    const debouncedMock = debounce(mock, 100);

    debouncedMock();

    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);

    expect(mock).not.toBeCalled();

    // should reset timer
    debouncedMock();

    jest.advanceTimersByTime(50);
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(mock).toBeCalledTimes(1);
  });

  it("cancel", () => {
    const mock = jest.fn();
    const debouncedMock = debounce(mock, 100);
    // should not do anything
    debouncedMock.cancel();

    debouncedMock();

    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);

    expect(mock).not.toBeCalled();

    debouncedMock.cancel();

    jest.advanceTimersByTime(50);

    expect(mock).toBeCalledTimes(0);

    // should work as usual after cancel
    debouncedMock();
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(mock).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(mock).toBeCalled();
  });
});
