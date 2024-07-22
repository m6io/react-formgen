import { z } from "zod";
import {
  createFormProviderAndHooks,
  FormState as CoreFormState,
} from "@react-formgen/core";
import { generateInitialData } from "./utils";

const createInitialData = (schema: z.ZodType<any>) =>
  generateInitialData(schema);

const getErrorsAtPath = (
  errors: z.ZodIssue[],
  path: string[]
): z.ZodIssue[] | undefined => {
  const errorMap: { [key: string]: z.ZodIssue[] } = {};

  errors.forEach((error) => {
    const fullPath = error.path.join("/");
    errorMap[fullPath] = errorMap[fullPath] || [];
    errorMap[fullPath].push(error);
  });

  const fullPath = path.join("/");
  return errorMap[fullPath] || [];
};

const {
  FormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayFieldset,
} = createFormProviderAndHooks<z.ZodType<any>, z.ZodIssue>(
  createInitialData,
  getErrorsAtPath
);

export type FormState = CoreFormState<z.ZodType<any>, z.ZodIssue>;

export {
  FormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayFieldset,
};

export * from "./components";
export * from "./utils";
