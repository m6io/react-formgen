import React from "react";
import { FormProps } from "./types";
import { BaseFormRoot, BaseTemplates } from "./Templates";
import { FormProvider } from "..";

/**
 * Form component that renders the form based on the schema.
 * @param {FormProps} props - The props for the Form.
 * @returns {JSX.Element} The form component.
 *
 */
export const Form: React.FC<FormProps> = ({
  schema,
  initialData = {},
  onSubmit = (data) =>
    console.warn(
      "This is a default `onSubmit` function. You should override this if you want to do something with the form data.",
      data
    ),
  onError = (errors, data) =>
    console.error(
      "This is a default `onError` function. You should override this if you want to do something with the form errors.",
      errors,
      data
    ),
  templates = BaseTemplates,
  formRoot: FormRoot = BaseFormRoot,
  readonly = false,
}) => {
  return (
    <FormProvider
      schema={schema}
      initialData={initialData}
      templates={templates}
      readonly={readonly}
    >
      <FormRoot onSubmit={onSubmit} onError={onError} />
    </FormProvider>
  );
};
