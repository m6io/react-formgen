import * as Yup from "yup";
import {
  createFormProviderAndHooks,
  FormState as CoreFormState,
} from "@react-formgen/core";
import { generateInitialData } from "./utils";
import {
  BaseFormRoot,
  BaseTemplates,
  RenderTemplate as DefaultRenderTemplate,
} from "./components";

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
  useArrayTemplate,
  useTemplates,
  useRenderTemplate,
  Form,
} = createFormProviderAndHooks<Yup.AnySchema, Yup.ValidationError>(
  createInitialData,
  getErrorsAtPath,
  DefaultRenderTemplate,
  BaseFormRoot,
  BaseTemplates
);

export type FormState = CoreFormState<Yup.AnySchema, Yup.ValidationError>;

export {
  FormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayTemplate,
  useTemplates,
  useRenderTemplate,
  Form,
};

export * from "./components";
export * from "./utils";
