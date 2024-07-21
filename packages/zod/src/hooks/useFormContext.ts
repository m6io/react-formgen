import { useFormContext as useCoreFormContext } from "@react-formgen/core";
import { z } from "zod";
import { FormState } from "../components";

export const useFormContext = <T>(selector: (state: FormState) => T): T => {
  return useCoreFormContext<z.ZodType<any>, z.ZodIssue, T>(selector);
};
