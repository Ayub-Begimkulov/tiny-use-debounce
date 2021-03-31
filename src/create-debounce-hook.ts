import { useLayoutEffect, useMemo, useRef } from "react";
import { unstable_batchedUpdates } from "react-dom";

export interface AnyFunction {
  (...args: any[]): any;
}

type GetStaticMethods<T extends AnyFunction> = {
  [K in keyof T]: T[K];
};

type Tail<T extends readonly unknown[]> = T extends [unknown, ...infer U]
  ? U
  : never;

// make sure debounce function to has a callback as a first argument
type BaseDebouncer = (callback: AnyFunction, ...rest: any[]) => any;

type DebounceFunction<
  Callback extends AnyFunction,
  Debounce extends BaseDebouncer
> = {
  (...args: Parameters<Callback>): void;
} & GetStaticMethods<ReturnType<Debounce>>;

export function createDebounceHook<DebounceFn extends BaseDebouncer>(
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
