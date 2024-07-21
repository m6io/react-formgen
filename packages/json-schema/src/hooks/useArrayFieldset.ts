import { JSONSchema7 } from "json-schema";
import { getZeroState } from "../utils/getZeroState";
import { useFormDataAtPath, useErrorsAtPath } from "..";

// Custom hook for array manipulation
export const useArrayFieldset = (
  path: string[],
  schema: JSONSchema7,
  definitions: any,
  defaultOnNull: any = null
) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, defaultOnNull);
  const errorsAtPath = useErrorsAtPath(path);

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
    setValueAtPath([
      ...valueAtPath,
      getZeroState(schema.items as JSONSchema7, definitions),
    ]);
  };

  return {
    valueAtPath,
    errorsAtPath,
    moveItem,
    removeItem,
    addItem,
  };
};
