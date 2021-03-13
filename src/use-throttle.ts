import { throttle } from "./debounce";
import { createDebounceHook } from "./create-debounce-hook";

export const useThrottle = createDebounceHook(throttle);
