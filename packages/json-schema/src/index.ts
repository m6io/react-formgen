import { JSONSchema7 } from "json-schema";
import {
  createFormProviderAndHooks,
  FormState as CoreFormState,
} from "@react-formgen/core";
import { ErrorObject } from "ajv";
import { generateInitialData } from "./utils";

const createInitialData = (schema: JSONSchema7) =>
  generateInitialData(schema, schema.definitions || {});

const getErrorsAtPath = (
  errors: ErrorObject[],
  path: string[]
): ErrorObject[] | undefined => {
  const errorMap: { [key: string]: ErrorObject[] } = {};

  errors.forEach((error) => {
    const fullPath = error.instancePath
      ? `/${(error.instancePath || "").split("/").slice(1).join("/")}`
      : "/";
    const missingPath =
      error.keyword === "required"
        ? `${fullPath === "/" ? "" : fullPath}/${error.params.missingProperty}`
        : fullPath;
    errorMap[missingPath] = errorMap[missingPath] || [];
    errorMap[missingPath].push(error);
  });

  const fullPath = `/${path.join("/")}`;
  return errorMap[fullPath] || [];
};

const { FormProvider, useFormContext, useFormDataAtPath, useErrorsAtPath } =
  createFormProviderAndHooks<JSONSchema7, ErrorObject>(
    createInitialData,
    getErrorsAtPath
  );

export type FormState = CoreFormState<JSONSchema7, ErrorObject>;

export { FormProvider, useFormContext, useFormDataAtPath, useErrorsAtPath };

export * from "./types";
export * from "./components";
export * from "./hooks";
export * from "./utils";
