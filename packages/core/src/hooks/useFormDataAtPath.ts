import { useFormContext } from "./useFormContext";

/**
 * Custom hook to get and set form data at a specific path in the form state.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
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
