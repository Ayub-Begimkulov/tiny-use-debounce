import throttle from "lodash/throttle";
import { createDebounceHook } from "./create-debounce-hook";

export const useThrottle = createDebounceHook(throttle);
