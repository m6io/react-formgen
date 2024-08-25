import { z } from "zod";
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

const createInitialData = (schema: z.ZodTypeAny) => generateInitialData(schema);

const getErrorsAtPath = (
  errors: z.ZodIssue[],
  path: string[]
): z.ZodIssue[] | undefined => {
  const errorMap: { [key: string]: z.ZodIssue[] } = {};

  // Normalize the error paths to handle array indices
  const normalizePath = (path: string): string => {
    return path.replace(/\[(\d+)\]/g, ".$1");
  };

  errors.forEach((error) => {
    const fullPath = normalizePath(error.path.join("."));
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
} = createFormProviderAndHooks<z.ZodTypeAny, z.ZodIssue>(
  createInitialData,
  getErrorsAtPath,
  DefaultRenderTemplate,
  BaseFormRoot,
  BaseTemplates
);

export type FormState = CoreFormState<z.ZodTypeAny, z.ZodIssue>;

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
