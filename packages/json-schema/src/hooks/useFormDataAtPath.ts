import { useFormContext } from "./useFormContext";

// Custom hook to get form data at a specific path
export const useFormDataAtPath = (
  path: string[],
  defaultOnNull: unknown = null
): [any, (value: any) => void] => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath =
    path.reduce((acc, key) => acc?.[key], formData) ?? defaultOnNull;

  const setValueAtPath = (value: any) => setFormData(path, value);

  return [valueAtPath, setValueAtPath];
};
