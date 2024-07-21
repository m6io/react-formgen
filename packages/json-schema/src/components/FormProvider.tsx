import React from "react";
import { JSONSchema7 } from "json-schema";
import { generateInitialData } from "../utils";
import {
  FormProvider as CoreFormProvider,
  FormState as CoreFormState,
} from "@react-formgen/core";
import { ErrorObject } from "ajv";

export interface FormProviderProps {
  initialData?: any;
  schema: JSONSchema7;
  children: React.ReactNode;
}

export type FormState = CoreFormState<JSONSchema7, ErrorObject>;

export const FormProvider: React.FC<FormProviderProps> = ({
  initialData = {},
  schema,
  children,
}) => {
  const createInitialData = (schema: JSONSchema7) =>
    generateInitialData(schema, schema.definitions || {});

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
