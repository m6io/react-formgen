import React from "react";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { JSONSchema7 } from "json-schema";
import { DisplayTemplateProps, FormTemplateProps } from "../../types";
import { RenderTemplate } from "../../RenderTemplate";
import { FormState, useFormContext } from "../../..";

// Single shared Ajv instance with formats
export const AjvInstance = new Ajv({
  allErrors: true,
  verbose: true,
}).addKeyword("uiSchema");
addFormats(AjvInstance);

/**
 * Form component that renders the form based on the schema.
 * @param {FormTemplateProps} props - The props for the BaseFormTemplate.
 * @returns {JSX.Element} The form component.
 */
export const BaseFormTemplate: React.FC<FormTemplateProps> = ({
  onSubmit,
  onError,
  fieldTemplates,
}) => {
  const { schema, formData, setErrors } = useFormContext(
    (state: FormState) => state
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validate = AjvInstance.compile(schema);
    const valid = validate(formData);
    if (valid) {
      setErrors(null);
      onSubmit(formData);
    } else {
      setErrors(validate.errors ?? null);
      onError(validate.errors ?? [], formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {Object.keys(schema.properties || {}).map((key) => (
        <RenderTemplate
          key={key}
          schema={schema.properties?.[key] as JSONSchema7}
          path={[key]}
          definitions={schema.definitions || {}}
          fieldTemplates={fieldTemplates}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Form component that renders the form based on the schema.
 * @param {DataDisplayProps} props - The props for the DataDisplay.
 * @returns {JSX.Element} The form component.
 */
export const BaseDisplayTemplate: React.FC<DisplayTemplateProps> = ({
  fieldTemplates,
}) => {
  const { schema } = useFormContext((state: FormState) => state);

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {Object.keys(schema.properties || {}).map((key) => (
        <RenderTemplate
          key={key}
          schema={schema.properties?.[key] as JSONSchema7}
          path={[key]}
          definitions={schema.definitions || {}}
          fieldTemplates={fieldTemplates}
          readOnly={true}
        />
      ))}
    </div>
  );
};
