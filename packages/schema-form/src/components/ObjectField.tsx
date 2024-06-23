import React from "react";
import { JSONSchema7 } from "json-schema";
import { CustomFields, ObjectSchema } from "./types";
import { renderField } from "./renderField";

// Object Field Component Template
export const ObjectField: React.FC<{
  schema: ObjectSchema;
  path: string[];
  definitions: any;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
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
