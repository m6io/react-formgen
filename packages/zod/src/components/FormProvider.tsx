import React from "react";
import { z } from "zod";
import { generateInitialData } from "../utils";
import {
  FormProvider as CoreFormProvider,
  FormState as CoreFormState,
} from "@react-formgen/core";

export interface FormProviderProps {
  initialData?: any;
  schema: z.ZodType<any>;
  children: React.ReactNode;
}

export type FormState = CoreFormState<z.ZodType<any>, z.ZodIssue>;

export const FormProvider: React.FC<FormProviderProps> = ({
  initialData = {},
  schema,
  children,
}) => {
  const createInitialData = (schema: z.ZodType<any>) =>
    generateInitialData(schema);

  return (
    <CoreFormProvider
      initialData={initialData}
      schema={schema}
      createInitialData={createInitialData}
    >
      {children}
    </CoreFormProvider>
  );
};
