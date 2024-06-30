import React from "react";
import { JSONSchema7 } from "json-schema";
import { CustomFields, BaseObjectSchema, SchemaDefinitions } from "../types";
import { renderField } from "../renderField";
import { useFieldErrors } from "../../context/useFormContext";

// Object Field Component Template
export const ObjectField: React.FC<{
  schema: BaseObjectSchema;
  path: string[];
  definitions: SchemaDefinitions;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
  const errorsAtPath = useFieldErrors(path);

  return (
    <div
      style={{
        border: "1px solid",
        padding: "10px",
        margin: "10px 0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {schema.title && <label>{schema.title}</label>}
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div key={index} style={{ color: "red" }}>
            {error.message}
          </div>
        ))}
      <br />
      {schema.properties &&
        Object.keys(schema.properties).map((key) => (
          <div key={key}>
            {renderField(
              schema.properties?.[key] as JSONSchema7,
              [...path, key],
              definitions,
              customFields
            )}
          </div>
        ))}
    </div>
  );
};
