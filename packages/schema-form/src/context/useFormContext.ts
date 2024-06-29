import { useContext } from "react";
import { useStore } from "zustand";
import { FormState } from "./FormProvider";
import { FormContext } from "./FormProvider";
import { ErrorObject } from "ajv";

// Custom hook to access form store
export const useFormContext = <T>(selector: (state: FormState) => T): T => {
  const store = useContext(FormContext);
  if (!store) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return useStore(store, selector);
};

// Custom hook to get form data at a specific path
export const useFieldData = (path: string[]): [any, (value: any) => void] => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? null;

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
