import { z } from "zod";
import {
  createFormProviderAndHooks,
  FormState as CoreFormState,
} from "@react-formgen/core";
import { generateInitialData } from "./utils";

const createInitialData = (schema: z.ZodType<any>) =>
  generateInitialData(schema);

const { FormProvider, useFormContext, useFormDataAtPath } =
  createFormProviderAndHooks<z.ZodType<any>, z.ZodIssue>(createInitialData);

export type FormState = CoreFormState<z.ZodType<any>, z.ZodIssue>;

export { FormProvider, useFormContext, useFormDataAtPath };

export * from "./components";
export * from "./hooks";
export * from "./utils";
