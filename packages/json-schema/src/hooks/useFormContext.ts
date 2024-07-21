import { useFormContext as useCoreFormContext } from "@react-formgen/core";
import { JSONSchema7 } from "json-schema";
import { ErrorObject } from "ajv";
import { FormState } from "../components";

// Custom hook to access form store
export const useFormContext = <T>(selector: (state: FormState) => T): T => {
  return useCoreFormContext<JSONSchema7, ErrorObject, T>(selector);
};
