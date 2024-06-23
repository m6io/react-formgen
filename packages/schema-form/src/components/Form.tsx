import React from "react";
import { ErrorObject } from "ajv";
import { JSONSchema7 } from "json-schema";
import { CustomFields } from "./types";
import { FormProvider } from "../context/FormProvider";
import { FormComponent } from "./FormComponent";

// Form component with provider
export const Form: React.FC<{
  schema: JSONSchema7;
  initialData?: any;
  onSubmit: (data: any) => void;
  onError: (errors: ErrorObject[]) => void;
  customFields?: CustomFields;
}> = ({ schema, initialData = {}, onSubmit, onError, customFields }) => {
  return (
    <FormProvider schema={schema} initialData={initialData}>
      <FormComponent
        onSubmit={onSubmit}
        onError={onError}
        customFields={customFields}
      />
    </FormProvider>
  );
};
