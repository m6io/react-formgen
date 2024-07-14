import React from "react";
import { FormProps } from "./types";
import { FormProvider } from "./FormProvider";
import { BaseFormTemplate, BaseFieldTemplates } from "./templates";

/**
 * Form component that renders the form based on the schema.
 * @param {FormProps} props - The props for the Form.
 * @returns {JSX.Element} The form component.
 *
 */
export const Form: React.FC<FormProps> = ({
  schema,
  initialData = {},
  onSubmit,
  onError,
  fieldTemplates = BaseFieldTemplates,
  formTemplate: FormTemplate = BaseFormTemplate,
}) => {
  return (
    <FormProvider schema={schema} initialData={initialData}>
      <FormTemplate
        onSubmit={onSubmit}
        onError={onError}
        fieldTemplates={fieldTemplates}
      />
    </FormProvider>
  );
};
