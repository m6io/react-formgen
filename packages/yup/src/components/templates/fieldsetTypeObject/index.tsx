import React from "react";
import * as Yup from "yup";
import { FieldTemplates } from "../../types";
import { RenderTemplate } from "../../RenderTemplate";
import { useErrorsAtPath } from "../../..";

// Object Fieldset Component Template
export const ObjectFieldset: React.FC<{
  schema: Yup.ObjectSchema<any>;
  path: string[];
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, fieldTemplates }) => {
  const errorsAtPath = useErrorsAtPath(path);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      {schema.describe().meta?.description && (
        <small>{schema.describe().meta?.description}</small>
      )}
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
        {schema.fields &&
          Object.keys(schema.fields).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.fields[key] as Yup.AnySchema}
              path={[...path, key]}
              fieldTemplates={fieldTemplates}
            />
          ))}
      </div>
    </div>
  );
};

// Object Display Component Template
export const ObjectDisplay: React.FC<{
  schema: Yup.ObjectSchema<any>;
  path: string[];
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, fieldTemplates }) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
        paddingLeft: "1rem",
        borderLeft: "2px solid #ccc",
      }}
    >
      {schema.describe().meta?.title && (
        <strong>{schema.describe().meta?.title}</strong>
      )}
      {schema.describe().meta?.description && (
        <p style={{ fontSize: "small", color: "#666" }}>
          {schema.describe().meta?.description}
        </p>
      )}
      <div style={{ marginTop: "0.5rem" }}>
        {schema.fields && Object.keys(schema.fields).length > 0 ? (
          Object.keys(schema.fields).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.fields[key] as Yup.AnySchema}
              path={[...path, key]}
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
