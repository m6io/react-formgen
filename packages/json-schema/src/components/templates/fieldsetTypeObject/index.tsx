import React from "react";
import { JSONSchema7 } from "json-schema";
import {
  BaseObjectSchema,
  FieldTemplates,
  SchemaDefinitions,
} from "@/components/types";
import { RenderTemplate } from "@/components/RenderTemplate";
import { useErrorsAtPath } from "@/hooks/useErrorsAtPath";

// Object Fieldset Component Template
export const ObjectFieldset: React.FC<{
  schema: BaseObjectSchema;
  path: string[];
  definitions: SchemaDefinitions;
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, definitions, fieldTemplates }) => {
  const errorsAtPath = useErrorsAtPath(path);

  return (
    <div
      style={{
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
      <div
        style={{
          border: "0.125rem solid",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {schema.properties &&
          Object.keys(schema.properties).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.properties?.[key] as JSONSchema7}
              path={[...path, key]}
              definitions={definitions}
              fieldTemplates={fieldTemplates}
            />
          ))}
      </div>
    </div>
  );
};
