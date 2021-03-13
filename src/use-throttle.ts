import throttle from "lodash/throttle";
import { createDebounceHook } from "./create-debounce-hook";

export const useThrottledCallback = createDebounceHook(throttle);
