import React from "react";
import { JSONSchema7 } from "json-schema";
import { ArraySchema, CustomFields, SchemaDefinitions } from "../types";
import { getZeroState } from "../../utils/getZeroState";
import { renderField } from "../renderField";
import { useFieldData, useFieldErrors } from "../../context/useFormContext";

// Array Field Component Template
export const ArrayField: React.FC<{
  schema: ArraySchema;
  path: string[];
  definitions: SchemaDefinitions;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
  const [valueAtPath, setValueAtPath] = useFieldData(path);
  const errorsAtPath = useFieldErrors(path);

  return (
    <div
      style={{
        border: ".25rem dashed slategray",
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
      {schema.items &&
        Array.isArray(valueAtPath) &&
        valueAtPath.map((_, index: number) => (
          <div
            style={{
              border: ".5px dotted lime",
              padding: "10px",
              margin: "10px 0",
            }}
            key={index}
          >
            {renderField(
              schema.items as JSONSchema7,
              [...path, index.toString()],
              definitions,
              customFields
            )}
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
        ))}
      <button
        style={{ margin: "20px 0" }}
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
  );
};
