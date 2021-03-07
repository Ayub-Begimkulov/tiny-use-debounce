import { useLayoutEffect, useMemo, useRef } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { debounce, throttle } from "lodash-es";

interface AnyFunction {
  (...args: any[]): any;
}

type GetStaticMethods<T extends AnyFunction> = {
  [K in keyof T]: T[K];
};

type Tail<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never;

type DebounceFunction<T extends AnyFunction, U extends AnyFunction> = {
  (...args: Parameters<T>): void;
} & GetStaticMethods<ReturnType<U>>;

export function createDebouncedHook<DebounceFn extends AnyFunction>(
  debounce: DebounceFn
) {
  return function useDebounce<Callback extends AnyFunction>(
    cb: Callback,
    ...rest: Tail<Parameters<DebounceFn>>
  ): DebounceFunction<Callback, DebounceFn> {
    const latestCb = useLatest(cb);
    return useMemo(
      () =>
        debounce((...args: Parameters<Callback>) => {
          unstable_batchedUpdates(() => {
            latestCb.current(...args);
          });
        }, ...rest),
      [latestCb, ...rest]
    );
  };
}

export const useDebounce = createDebouncedHook(debounce);
export const useThrottle = createDebouncedHook(throttle);

function useLatest<T>(value: T) {
  const valueRef = useRef(value);
  useLayoutEffect(() => {
    valueRef.current = value;
  });
  return valueRef;
}
