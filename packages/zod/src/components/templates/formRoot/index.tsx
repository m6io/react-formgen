import React from "react";
import { z } from "zod";
import { useFormContext } from "../../../hooks/useFormContext";
import { DisplayTemplateProps, FormTemplateProps } from "../../types";
import { RenderTemplate } from "../../RenderTemplate";
import { FormState } from "../../FormProvider";

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
    const result = schema.safeParse(formData);
    if (result.success) {
      setErrors(null);
      onSubmit(result.data);
    } else {
      setErrors(result.error.issues);
      onError(result.error.issues, formData);
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
      {Object.keys((schema as z.ZodObject<any>).shape).map((key) => (
        <RenderTemplate
          key={key}
          schema={(schema as z.ZodObject<any>).shape[key]}
          path={[key]}
          fieldTemplates={fieldTemplates}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

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
      {Object.keys((schema as z.ZodObject<any>).shape).map((key) => (
        <RenderTemplate
          key={key}
          schema={(schema as z.ZodObject<any>).shape[key]}
          path={[key]}
          fieldTemplates={fieldTemplates}
          readOnly={true}
        />
      ))}
    </div>
  );
};
