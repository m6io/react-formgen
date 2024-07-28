import { useFormDataAtPath } from "./useFormDataAtPath";
import { useErrorsAtPath } from "./useErrorsAtPath";

/**
 * Schema-specific hook for array manipulation.
 * @template S - Schema type.
 * @template E - Error type.
 * @param {string[]} path - Path to the array data.
 * @param {() => any} zeroState - Function to get the zero state for the array items.
 * @param {any} defaultOnNull - Default value if the data at the path is null.
 * @param {(errors: E[], path: string[]) => E[] | undefined} getErrorsAtPath - Function to get errors at a specific path.
 * @returns {Object} An object containing the array data, errors at the path, and functions to manipulate the array.
 * @example
 * ```
 * const { valueAtPath, addItem, removeItem, moveItem } = useArrayFieldset(["arrayField"], () => ({}), getErrorsAtPath);
 * ```
 */
export const useArrayFieldset = <S, E>(
  path: string[],
  zeroState: () => any,
  defaultOnNull: any = null,
  getErrorsAtPath: (errors: E[], path: string[]) => E[] | undefined
) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath<S, E>(
    path,
    defaultOnNull
  );
  const errorsAtPath = useErrorsAtPath<S, E>(path, getErrorsAtPath);

  const moveItem = (index: number, direction: "up" | "down") => {
    const newArray = [...valueAtPath];
    const [movedItem] = newArray.splice(index, 1);
    newArray.splice(direction === "up" ? index - 1 : index + 1, 0, movedItem);
    setValueAtPath(newArray);
  };

  const removeItem = (index: number) => {
    const newArray = [...valueAtPath];
    newArray.splice(index, 1);
    setValueAtPath(newArray);
  };

  const addItem = () => {
    setValueAtPath([...valueAtPath, zeroState()]);
  };

  return {
    valueAtPath,
    errorsAtPath,
    moveItem,
    removeItem,
    addItem,
  };
};
