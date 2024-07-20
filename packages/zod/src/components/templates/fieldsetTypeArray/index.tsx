import React from "react";
import { z } from "zod";
import { useArrayFieldset, useFormDataAtPath } from "../../../hooks";
import { FieldTemplates } from "../../types";
import { RenderTemplate } from "../../RenderTemplate";

export const ArrayFieldset: React.FC<{
  schema: z.ZodArray<any>;
  path: string[];
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, fieldTemplates }) => {
  const { valueAtPath, errorsAtPath, moveItem, removeItem, addItem } =
    useArrayFieldset(path, schema);

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
          border: "0.25rem dashed",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {Array.isArray(valueAtPath) &&
          valueAtPath.map((_, index: number) => (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              key={index}
            >
              <RenderTemplate
                schema={schema.element}
                path={[...path, index.toString()]}
                fieldTemplates={fieldTemplates}
              />
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "0.125rem dashed",
                }}
              >
                <button
                  type="button"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                >
                  Move Up
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === valueAtPath.length - 1}
                >
                  Move Down
                </button>
                <button type="button" onClick={() => removeItem(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        <button type="button" onClick={addItem}>
          Add Item
        </button>
      </div>
    </div>
  );
};

export const ArrayDisplay: React.FC<{
  schema: z.ZodArray<any>;
  path: string[];
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, fieldTemplates }) => {
  const [valueAtPath] = useFormDataAtPath(path);

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
        {Array.isArray(valueAtPath) && valueAtPath.length > 0 ? (
          valueAtPath.map((_, index: number) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <RenderTemplate
                schema={schema.element}
                path={[...path, index.toString()]}
                fieldTemplates={fieldTemplates}
                readOnly={true}
              />
            </div>
          ))
        ) : (
          <div style={{ color: "#888" }}>No items available</div>
        )}
      </div>
    </div>
  );
};
