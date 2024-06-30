import { useContext } from "react";
import { useStore } from "zustand";
import { FormState } from "./FormProvider";
import { FormContext } from "./FormProvider";
import { ErrorObject } from "ajv";
import { getZeroState } from "../utils";
import { JSONSchema7 } from "json-schema";

// Custom hook to access form store
export const useFormContext = <T>(selector: (state: FormState) => T): T => {
  const store = useContext(FormContext);
  if (!store) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return useStore(store, selector);
};

// Custom hook to get form data at a specific path
export const useFieldData = (
  path: string[],
  defaultOnNull: any = null
): [any, (value: any) => void] => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath =
    path.reduce((acc, key) => acc?.[key], formData) ?? defaultOnNull;

  const setValueAtPath = (value: any) => setFormData(path, value);

  return [valueAtPath, setValueAtPath];
};

// Custom hook to get form errors at a specific path
export const useFieldErrors = (path: string[]): ErrorObject[] | undefined => {
  const errors = useFormContext((state) => state.errors);

  const getErrorsAtPath = (path: string[]): ErrorObject[] | undefined => {
    const errorMap: { [key: string]: ErrorObject[] } = {};

    errors?.forEach((error) => {
      const fullPath = `/${(error.instancePath || "")
        .split("/")
        .slice(1)
        .join("/")}`;
      const missingPath =
        error.keyword === "required"
          ? `${fullPath}/${error.params.missingProperty}`
          : fullPath;
      errorMap[missingPath] = errorMap[missingPath] || [];
      errorMap[missingPath].push(error);
    });

    const fullPath = `/${path.join("/")}`;
    const fieldErrors = errorMap[fullPath] || [];

    return fieldErrors;
  };

  return getErrorsAtPath(path);
};

// Custom hook for array field manipulation
export const useArrayField = (
  path: string[],
  schema: JSONSchema7,
  definitions: any,
  defaultOnNull: any = null
) => {
  const [valueAtPath, setValueAtPath] = useFieldData(path, defaultOnNull);
  const errorsAtPath = useFieldErrors(path);

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
