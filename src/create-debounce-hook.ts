import { useLayoutEffect, useMemo, useRef } from "react";
import { unstable_batchedUpdates } from "react-dom";

export interface AnyFunction {
  (...args: any[]): any;
}

type GetStaticMethods<T extends AnyFunction> = {
  [K in keyof T]: T[K];
};

type Tail<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never;

type DebounceFunction<T extends AnyFunction, U extends AnyFunction> = {
  (...args: Parameters<T>): void;
} & GetStaticMethods<ReturnType<U>>;

export function createDebounceHook<DebounceFn extends AnyFunction>(
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

function useLatest<T>(value: T) {
  const valueRef = useRef(value);
  useLayoutEffect(() => {
    valueRef.current = value;
  });
  return valueRef;
}
