import React from "react";
import { useFormContext } from "../context/useFormContext";
import { ErrorObject } from "ajv";
import { NumberSchema } from "./types";

// Number Field Component Template
export const NumberField: React.FC<{
  schema: NumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const errors = useFormContext((state) => state.errors);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? null;

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.value ? Number(event.target.value) : null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {schema.title && <label>{schema.title}</label>}
      <input
        type="number"
        value={valueAtPath ?? ""}
        onChange={handleChange}
        placeholder={schema.title || ""}
        list={
          Array.isArray(schema.examples)
            ? `${path.join("-")}-datalist`
            : undefined
        }
        style={{ width: "100px" }}
      />
      {schema.description && <small>{schema.description}</small>}
      {Array.isArray(schema.examples) && (
        <datalist id={`${path.join("-")}-datalist`}>
          {schema.examples.map((example, index) => (
            <option key={index} value={example as number} />
          ))}
        </datalist>
      )}
      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div key={index} style={{ color: "red" }}>
            {error.message}
          </div>
        ))}
    </div>
  );
};
