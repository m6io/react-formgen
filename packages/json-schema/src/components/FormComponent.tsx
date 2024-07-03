import React from "react";
import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { JSONSchema7 } from "json-schema";
import { useFormContext } from "../context/useFormContext";
import { CustomFields } from "./types";
import { renderField } from "./renderField";

// Single shared Ajv instance with formats
export const AjvInstance = new Ajv({
  allErrors: true,
  verbose: true,
}).addKeyword("uiSchema");
addFormats(AjvInstance);

// Form Component Template
export const FormComponent: React.FC<{
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: ErrorObject[], data?: { [key: string]: unknown }) => void;
  customFields?: CustomFields;
}> = ({ onSubmit, onError, customFields = {} }) => {
  const schema = useFormContext((state) => state.schema);
  const formData = useFormContext((state) => state.formData);
  const setErrors = useFormContext((state) => state.setErrors);

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
    <form onSubmit={handleSubmit}>
      {Object.keys(schema.properties || {}).map((key) => (
        <div key={key} style={{ marginBottom: "10px" }}>
          {renderField(
            schema.properties?.[key] as JSONSchema7,
            [key],
            schema.definitions || {},
            customFields
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
