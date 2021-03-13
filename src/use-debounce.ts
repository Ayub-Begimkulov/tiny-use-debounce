import { debounce } from "./debounce";
import { createDebounceHook } from "./create-debounce-hook";

export const useDebounce = createDebounceHook(debounce);
