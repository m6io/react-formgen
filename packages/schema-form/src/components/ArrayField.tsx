import React from "react";
import { JSONSchema7 } from "json-schema";
import { useFormContext } from "../context/useFormContext";
import { ArraySchema, CustomFields } from "./types";
import { ErrorMessage } from "./index";
import { getZeroState } from "../utils/getZeroState";
import { renderField } from "./renderField";

// Array Field Component Template
export const ArrayField: React.FC<{
  schema: ArraySchema;
  path: string[];
  definitions: any;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? [];

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
      <br />
      {schema.items &&
        Array.isArray(valueAtPath) &&
        valueAtPath.map((_: any, index: number) => (
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
                setFormData(path, newArray);
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
          setFormData(path, [
            ...valueAtPath,
            getZeroState(schema.items as JSONSchema7, definitions),
          ]);
        }}
      >
        Add Item
      </button>
      <ErrorMessage path={path} />
    </div>
  );
};
