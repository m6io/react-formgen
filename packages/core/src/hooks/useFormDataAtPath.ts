import { useFormContext } from "./useFormContext";

/**
 * Hook to get and set form data at a specific path.
 * @template S - Schema type.
 * @template E - Error type.
 * @param {string[]} path - Path to the form data.
 * @param {unknown} defaultOnNull - Default value if the data at the path is null.
 * @returns {[any, (value: any) => void]} A tuple containing the data at the path and a function to set the data at the path.
 * @example
 * ```
 * const [value, setValue] = useFormDataAtPath(["field1", "field2"]);
 * ```
 */
export const useFormDataAtPath = <S, E>(
  path: string[],
  defaultOnNull: unknown = null
): [any, (value: any) => void] => {
  const formData = useFormContext<S, E, any>((state) => state.formData);
  const setFormData = useFormContext<
    S,
    E,
    (path: string[], value: any) => void
  >((state) => state.setFormData);
  const valueAtPath =
    path.reduce((acc, key) => acc?.[key], formData) ?? defaultOnNull;

  const setValueAtPath = (value: any) => setFormData(path, value);

  return [valueAtPath, setValueAtPath];
};
