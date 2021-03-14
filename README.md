# Tiny Use Debounce

React hooks for debouncing and throttling.

![Codecov](https://img.shields.io/codecov/c/github/Ayub-Begimkulov/tiny-use-debounce?style=flat-square)

## Features

- Tiny Size
- Highly customizable
- Fully tested
- TypeScript support out of the box

## Usage

```jsx
import { useDebounce, useThrottle } from "tiny-use-debounce";
import { debounce, throttle } from "lodash-es";

const App = () => {
  const debouncedMouseMove = useDebounce(() => console.log("mouse move"), 300);
  const throttledScroll = useDebounce(() => console.log("scroll"), 300);

  return (
    <div onMouseMove={debouncedMouseMove} onScroll={throttledScroll}>
      {/* ... */}
    </div>
  );
};
```

## Customization

If you want to pass custom `debounce` or `throttle` implementation (or any function that has similar interface), you could use `createDebounceHook`. It takes a function that'll debounce a callback and returns hook.

```jsx
import { createDebounceHook } from "tiny-use-debounce";
import { debounce, throttle } from "./some/file";

const useDebounce = createDebounceHook(debounce);
const useThrottle = createDebounceHook(throttle);
```

## Memoization

The function returned from the hook will be alway memoized and have the same reference if `options` object is referentially equal. So if they don't change between rerenders, move them out of the component. If the change, `useMemo` to prevent updates on each render.

```jsx
import { useMemo } from "react";
import { useDebounce } from "tiny-use-debounce";

// options are the same, we can move them out
// of the component
const stableOptions = { leading: true };

const App = ({ shouldCallInitially }) => {
  const debounceFn = useDebounce(
    () => {
      /* ... */
    },
    200,
    stableOptions
  );

  // options are dynamic, useMemo to reduce
  // updates
  const dynamicDebounceOptions = useMemo(
    () => ({ leading: shouldCallInitially }),
    [shouldCallInitially]
  );

  const debouncedFn2 = useDebounce(
    () => {
      /* ... */
    },
    200,
    dynamicDebounceOptions
  );
};
```

## API

### `createDebounceHook`

Usage:

- `createDebounceHook(debounce)`

Creates hook that uses proved function for debouncing.

### `useDebounce`

Usage:

- `useDebounce(cb, wait?, options?)`

Creates debounced function.

### `useThrottle`

Usage:

- `useThrottle(cb, wait?, options?)`

Creates throttled function.

## License

[MIT](./LICENSE)
