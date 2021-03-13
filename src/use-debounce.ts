import debounce from "lodash/debounce";
import { createDebounceHook } from "./create-debounce-hook";

export const useDebouncedCallback = createDebounceHook(debounce);
