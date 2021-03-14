# Tiny Use Debounce

React hooks for debouncing and throttling.

![Codecov](https://img.shields.io/codecov/c/github/Ayub-Begimkulov/tiny-use-debounce?style=flat-square)

## Features

- Tiny Size
- Highly customizable
- Fully tested
- TypeScript support out of the box

## Installation

```shell
# npm
npm i tiny-use-debounce

# yarn
yarn add tiny-use-debounce
```

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

## Customizing

This library uses its own implementations of `debounce` and `throttle` functions. But in some cases, you may want to change it (not enough options, smaller bundle size, etc.). For this purpose, you could use `createDebounceHook`:

```jsx
import { createDebounceHook } from "tiny-use-debounce";
import { debounce, throttle } from "lodash";

const useDebounce = createDebounceHook(debounce);
const useThrottle = createDebounceHook(throttle);

const options = {
  leading: true,
};

const App = () => {
  const debouncedFn = useDebounce(() => console.log("here"), 100, options);
  const throttledFn = useThrottle(() => console.log("here"), 100, options);
  // ...
};
```

## Memoization

By default, functions returned from hooks will always be memoized.

```jsx
const debouncedFn = useDebounce(() => {
  /* ... */
}, 100);

useEffect(() => {
  /* ... */
}, [
  //could be safely used as a dependency since reference will never change
  debounceFn,
]);
```

But if you create your own hook with `createDebounceHook`, you need to be a little more cautious. The first argument (the callback) will not make any effect on memoization. But other arguments will be compared referentially. So if your `debounce` implementation uses objects as options they need to be declared outside of the component or memoized. Take a look at the example below:

```jsx
import { createDebounceHook } from "tiny-use-debounce";
import { debounce, throttle } from "lodash";

const useDebounce = createDebounceHook(debounce);

const stableOptions = { leading: true };

const App = () => {
  const options = { leading: true };

  // this function will be recreated on each rerender
  // because options object has new reference
  const debounceFn1 = useDebounce(
    () => {
      /* ... */
    },
    100,
    options
  );

  // this function will always have the same reference
  // because all additional arguments have the same
  // reference between renders
  const debounceFn2 = useDebounce(
    () => {
      /* ... */
    },
    100,
    stableOptions
  );

  const [leading, setLeading] = useState(true);
  const memoOptions = useMemo(() => ({ leading }), [leading]);

  // this function will only update when `leading`
  // changes, other updates will not break memoization
  const debounceFn3 = useDebounce(
    () => {
      /* ... */
    },
    100,
    memoOptions
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

- `useDebounce(cb, wait)`

Creates debounced function.

### `useThrottle`

Usage:

- `useThrottle(cb, wait)`

Creates throttled function.

## License

[MIT](./LICENSE)
