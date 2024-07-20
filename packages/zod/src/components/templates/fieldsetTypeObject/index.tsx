import React from "react";
import { z } from "zod";
import { FieldTemplates } from "../../types";
import { RenderTemplate } from "../../RenderTemplate";
import { useErrorsAtPath } from "../../../hooks";

export const ObjectFieldset: React.FC<{
  schema: z.ZodObject<any>;
  path: string[];
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, fieldTemplates }) => {
  const errorsAtPath = useErrorsAtPath(path);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {schema.description && <label>{schema.description}</label>}
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
        {Object.keys(schema.shape).map((key) => (
          <RenderTemplate
            key={key}
            schema={schema.shape[key]}
            path={[...path, key]}
            fieldTemplates={fieldTemplates}
          />
        ))}
      </div>
    </div>
  );
};

export const ObjectDisplay: React.FC<{
  schema: z.ZodObject<any>;
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
      {schema.description && <strong>{schema.description}</strong>}
      <div style={{ marginTop: "0.5rem" }}>
        {Object.keys(schema.shape).length > 0 ? (
          Object.keys(schema.shape).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.shape[key]}
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
