import React from "react";
import * as Yup from "yup";
import { DisplayTemplateProps, FormTemplateProps } from "../../types";
import { RenderTemplate } from "../../RenderTemplate";
import { FormState, useFormContext } from "../../..";
import { resolveSchema } from "../../../utils/resolveSchema";

// Helper function to check if schema is an ObjectSchema
const isObjectSchema = (
  schema: Yup.AnySchema
): schema is Yup.ObjectSchema<any> => {
  return resolveSchema(schema).type === "object";
};

// Form Component Template
export const BaseFormTemplate: React.FC<FormTemplateProps> = ({
  onSubmit,
  onError,
  fieldTemplates,
}) => {
  const { schema, formData, setErrors } = useFormContext(
    (state: FormState) => state
  );

  const resolvedSchema = resolveSchema(schema);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      resolvedSchema.validateSync(formData, { abortEarly: false });
      setErrors(null);
      onSubmit(formData);
    } catch (validationErrors) {
      const yupErrors = validationErrors as Yup.ValidationError;
      setErrors(yupErrors.inner);
      onError(yupErrors.inner, formData);
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
      {isObjectSchema(resolvedSchema) &&
        Object.keys(resolvedSchema.fields).map((key) => (
          <RenderTemplate
            key={key}
            schema={resolvedSchema.fields[key] as Yup.AnySchema}
            path={[key]}
            fieldTemplates={fieldTemplates}
          />
        ))}
      <button type="submit">Submit</button>
    </form>
  );
};

// Display Component Template
export const BaseDisplayTemplate: React.FC<DisplayTemplateProps> = ({
  fieldTemplates,
}) => {
  const { schema } = useFormContext((state: FormState) => state);
  const resolvedSchema = resolveSchema(schema);

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {isObjectSchema(resolvedSchema) &&
        Object.keys(resolvedSchema.fields).map((key) => (
          <RenderTemplate
            key={key}
            schema={resolvedSchema.fields[key] as Yup.AnySchema}
            path={[key]}
            fieldTemplates={fieldTemplates}
            readOnly={true}
          />
        ))}
    </div>
  );
};
