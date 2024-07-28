import { useFormContext } from "./useFormContext";

/**
 * Hook to get errors at a specific path.
 * @template S - Schema type.
 * @template E - Error type.
 * @param {string[]} path - Path to the errors.
 * @param {(errors: E[], path: string[]) => E[] | undefined} getErrorsAtPath - Function to get errors at a specific path.
 * @returns {E[] | undefined} The errors at the path.
 * @example
 * ```
 * const errors = useErrorsAtPath(["field1", "field2"], getErrorsAtPath);
 * ```
 */
export const useErrorsAtPath = <S, E>(
  path: string[],
  getErrorsAtPath: (errors: E[], path: string[]) => E[] | undefined
): E[] | undefined => {
  const errors = useFormContext<S, E, E[] | null>((state) => state.errors);
  return getErrorsAtPath(errors ?? [], path);
};
