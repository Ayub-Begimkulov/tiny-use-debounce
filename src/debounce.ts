import { AnyFunction } from "./create-debounce-hook";

const isNumber = (val: unknown): val is number => typeof val === "number";

export const debounce = <T extends AnyFunction>(fn: T, wait: number) => {
  let timeoutId: number | null = null;
  const cancel = () => {
    if (isNumber(timeoutId)) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  const debounced = (...args: Parameters<T>) => {
    cancel();
    timeoutId = window.setTimeout(() => {
      fn.apply(null, args);
      timeoutId = null;
    }, wait);
  };
  debounced.cancel = cancel;
  return debounced;
};

export const throttle = <T extends AnyFunction>(fn: T, wait: number) => {
  let timeoutId: number | null = null;
  const cancel = () => {
    if (isNumber(timeoutId)) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  const throttled = (...args: Parameters<T>) => {
    if (isNumber(timeoutId)) return;
    timeoutId = window.setTimeout(() => {
      fn.apply(null, args);
      timeoutId = null;
    }, wait);
  };
  throttled.cancel = cancel;
  return throttled;
};
