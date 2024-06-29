import React from "react";
import { useFormContext } from "../context/useFormContext";
import { BooleanSchema } from "./types";
import { ErrorObject } from "ajv";

// Boolean Field Component Template
export const BooleanField: React.FC<{
  schema: BooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const errors = useFormContext((state) => state.errors);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? false;

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
    setFormData(path, event.target.checked);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input type="checkbox" checked={valueAtPath} onChange={handleChange} />
        {schema.title && <label>{schema.title}</label>}
      </div>
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div key={index} style={{ color: "red" }}>
            {error.message}
          </div>
        ))}
    </div>
  );
};
