import React from "react";
import { JSONSchema7 } from "json-schema";
import { CustomFields, ObjectSchema, SchemaDefinitions } from "./types";
import { renderField } from "./renderField";
import { useFormContext } from "../context";
import { ErrorObject } from "ajv";

// Object Field Component Template
export const ObjectField: React.FC<{
  schema: ObjectSchema;
  path: string[];
  definitions: SchemaDefinitions;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
  const errors = useFormContext((state) => state.errors);

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
        border: "1px solid",
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
