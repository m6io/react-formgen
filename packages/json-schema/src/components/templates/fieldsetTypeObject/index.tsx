import React from "react";
import { JSONSchema7 } from "json-schema";
import {
  BaseObjectSchema,
  FieldTemplates,
  SchemaDefinitions,
} from "../../types";
import { RenderTemplate } from "../../RenderTemplate";
import { useErrorsAtPath } from "../../..";

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

// Object Display Component Template
export const ObjectDisplay: React.FC<{
  schema: BaseObjectSchema;
  path: string[];
  definitions: SchemaDefinitions;
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, definitions, fieldTemplates }) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
        paddingLeft: "1rem",
        borderLeft: "2px solid #ccc",
      }}
    >
      {schema.title && <strong>{schema.title}</strong>}
      {schema.description && (
        <p style={{ fontSize: "small", color: "#666" }}>{schema.description}</p>
      )}
      <div style={{ marginTop: "0.5rem" }}>
        {schema.properties && Object.keys(schema.properties).length > 0 ? (
          Object.keys(schema.properties).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.properties?.[key] as JSONSchema7}
              path={[...path, key]}
              definitions={definitions}
              fieldTemplates={fieldTemplates}
              readOnly={true}
            />
          ))
        ) : (
          <div style={{ color: "#888" }}>No data available</div>
        )}
      </div>
    </div>
  );
};
