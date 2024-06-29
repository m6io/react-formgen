import React from "react";
import { JSONSchema7 } from "json-schema";
import { useFormContext } from "../context/useFormContext";
import { ArraySchema, CustomFields, SchemaDefinitions } from "./types";
import { ErrorObject } from "ajv";
import { getZeroState } from "../utils/getZeroState";
import { renderField } from "./renderField";

// Array Field Component Template
export const ArrayField: React.FC<{
  schema: ArraySchema;
  path: string[];
  definitions: SchemaDefinitions;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const errors = useFormContext((state) => state.errors);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? [];

  const getErrorsAtPath = (path: string[]): ErrorObject[] | undefined => {
    const errorMap: { [key: string]: ErrorObject[] } = {};

    errors?.forEach((error) => {
      const fullPath = `/${(error.instancePath || "")
        .split("/")
        .slice(1)
        .join("/")}`;
      const missingPath =
        error.keyword === "required"
          ? `${fullPath}/${error.params.missingProperty}`
          : fullPath;
      errorMap[missingPath] = errorMap[missingPath] || [];
      errorMap[missingPath].push(error);
    });

    const fullPath = `/${path.join("/")}`;
    const fieldErrors = errorMap[fullPath] || [];

    return fieldErrors;
  };
  const [errorsAtPath, setErrorsAtPath] = React.useState<
    ErrorObject[] | undefined
  >(getErrorsAtPath(path));

  React.useEffect(() => {
    setErrorsAtPath(getErrorsAtPath(path));
  }, [errors]);

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
    </div>
  );
};
