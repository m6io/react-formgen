import * as Yup from "yup";
import {
  createFormProviderAndHooks,
  FormState as CoreFormState,
} from "@react-formgen/core";
import { generateInitialData } from "./utils";

const createInitialData = (schema: Yup.AnySchema) =>
  generateInitialData(schema);

const getErrorsAtPath = (
  errors: Yup.ValidationError[],
  path: string[]
): Yup.ValidationError[] | undefined => {
  const errorMap: { [key: string]: Yup.ValidationError[] } = {};

  // Normalize the error paths to handle array indices
  const normalizePath = (path: string): string => {
    return path.replace(/\[(\d+)\]/g, ".$1");
  };

  errors.forEach((error) => {
    const fullPath = normalizePath(error.path || "");
    errorMap[fullPath] = errorMap[fullPath] || [];
    errorMap[fullPath].push(error);
  });

  const fullPath = path.join(".");
  return errorMap[fullPath] || [];
};

const {
  FormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayFieldset,
} = createFormProviderAndHooks<Yup.AnySchema, Yup.ValidationError>(
  createInitialData,
  getErrorsAtPath
);

export type FormState = CoreFormState<Yup.AnySchema, Yup.ValidationError>;

export {
  FormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayFieldset,
};

export * from "./components";
export * from "./utils";
