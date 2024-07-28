import { useFormContext } from "./useFormContext";

/**
 * Custom hook to retrieve validation errors at a specific path in the form state.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 * @param {string[]} path - Path to the errors in the form state.
 * @param {(errors: E[], path: string[]) => E[] | undefined} getErrorsAtPath - Function to get errors at a specific path.
 * @returns {E[] | undefined} The errors at the specified path, if any.
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
