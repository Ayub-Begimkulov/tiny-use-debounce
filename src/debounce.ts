import { AnyFunction } from "./create-debounce-hook";

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

const isNumber = (val: unknown): val is number => typeof val === "number";

export const debounce = <T extends AnyFunction>(
  fn: T,
  wait: number,
  { trailing = true, leading = false, maxWait }: DebounceOptions = {}
) => {
  let timeoutId: number | null = null;
  let lastInvokeTime = 0;
  let startTime: number | null = null;
  const cancelTimeout = () => isNumber(timeoutId) && clearTimeout(timeoutId);
  const debounced = (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastInvokeTime >= wait && leading) {
      lastInvokeTime = now;
      fn(...args);
      return;
    }
    if (!trailing) return;
    cancelTimeout();
    const timeTillMax =
      isNumber(maxWait) &&
      (startTime ? Math.max(maxWait - now + startTime, 0) : maxWait);
    const remainingTime = isNumber(timeTillMax)
      ? Math.min(wait, timeTillMax)
      : wait;
    !isNumber(startTime) && (startTime = now);
    timeoutId = window.setTimeout(() => {
      lastInvokeTime = now;
      startTime = null;
      fn(...args);
    }, remainingTime);
  };
  debounced.cancel = () => {
    cancelTimeout();
    lastInvokeTime = 0;
    startTime = timeoutId = null;
  };
  return debounced;
};

export const throttle = <T extends AnyFunction>(
  fn: T,
  wait: number,
  options?: Omit<DebounceOptions, "maxWait">
) => {
  return debounce(fn, wait, { ...options, maxWait: wait });
};
