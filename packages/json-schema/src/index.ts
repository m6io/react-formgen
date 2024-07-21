import { JSONSchema7 } from "json-schema";
import {
  createFormProviderAndHooks,
  FormState as CoreFormState,
} from "@react-formgen/core";
import { ErrorObject } from "ajv";
import { generateInitialData } from "./utils";

const createInitialData = (schema: JSONSchema7) =>
  generateInitialData(schema, schema.definitions || {});

const { FormProvider, useFormContext, useFormDataAtPath } =
  createFormProviderAndHooks<JSONSchema7, ErrorObject>(createInitialData);

export type FormState = CoreFormState<JSONSchema7, ErrorObject>;

export { FormProvider, useFormContext, useFormDataAtPath };

export * from "./types";
export * from "./components";
export * from "./hooks";
export * from "./utils";
