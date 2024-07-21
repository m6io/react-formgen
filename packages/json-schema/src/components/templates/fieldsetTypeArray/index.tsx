import React from "react";
import { JSONSchema7 } from "json-schema";
import { useArrayFieldset, useFormDataAtPath, useErrorsAtPath } from "../../..";
import {
  BaseArraySchema,
  FieldTemplates,
  SchemaDefinitions,
} from "../../types";
import { RenderTemplate } from "../../RenderTemplate";
import { getZeroState } from "../../../utils";

// Array Fieldset Component Template
export const ArrayFieldset: React.FC<{
  schema: BaseArraySchema;
  path: string[];
  definitions: SchemaDefinitions;
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, definitions, fieldTemplates }) => {
  const { valueAtPath, errorsAtPath, moveItem, removeItem, addItem } =
    useArrayFieldset(path, schema, definitions);

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
          border: "0.25rem dashed",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {schema.items &&
          Array.isArray(valueAtPath) &&
          valueAtPath.map((_, index: number) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
              key={index}
            >
              <RenderTemplate
                schema={schema.items as JSONSchema7}
                path={[...path, index.toString()]}
                definitions={definitions}
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

// Array Display Component Template
export const ArrayDisplay: React.FC<{
  schema: BaseArraySchema;
  path: string[];
  definitions: SchemaDefinitions;
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, definitions, fieldTemplates }) => {
  const [valueAtPath] = useFormDataAtPath(path);

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
        {Array.isArray(valueAtPath) && valueAtPath.length > 0 ? (
          valueAtPath.map((_, index: number) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <RenderTemplate
                schema={schema.items as JSONSchema7}
                path={[...path, index.toString()]}
                definitions={definitions}
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

// Array Fieldset Component Template (This is a verbose example, not using the useArrayFieldset hook)
export const ArrayFieldsetVerbose: React.FC<{
  schema: BaseArraySchema;
  path: string[];
  definitions: SchemaDefinitions;
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, definitions, fieldTemplates }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);

  const moveItem = (index: number, direction: "up" | "down") => {
    const newArray = [...valueAtPath];
    const [movedItem] = newArray.splice(index, 1);
    newArray.splice(direction === "up" ? index - 1 : index + 1, 0, movedItem);
    setValueAtPath(newArray);
  };

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
          border: "0.25rem dashed",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {schema.items &&
          Array.isArray(valueAtPath) &&
          valueAtPath.map((_, index: number) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
              key={index}
            >
              <RenderTemplate
                schema={schema.items as JSONSchema7}
                path={[...path, index.toString()]}
                definitions={definitions}
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
                <button
                  type="button"
                  onClick={() => {
                    const newArray = [...valueAtPath];
                    newArray.splice(index, 1);
                    setValueAtPath(newArray);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        <button
          type="button"
          onClick={() => {
            setValueAtPath([
              ...valueAtPath,
              getZeroState(schema.items as JSONSchema7, definitions),
            ]);
          }}
        >
          Add Item
        </button>
      </div>
    </div>
  );
};
