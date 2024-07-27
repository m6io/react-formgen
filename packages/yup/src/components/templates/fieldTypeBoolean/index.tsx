import React from "react";
import * as Yup from "yup";
import { useFormDataAtPath, useErrorsAtPath } from "../../..";

// Boolean Field Component Template
export const BooleanField: React.FC<{
  schema: Yup.BooleanSchema<boolean | undefined>;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAtPath(event.target.checked);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      <input type="checkbox" checked={valueAtPath} onChange={handleChange} />
      {schema.describe().meta?.description && (
        <small>{schema.describe().meta?.description}</small>
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

// Boolean Display Component Template
export const BooleanDisplay: React.FC<{
  schema: Yup.BooleanSchema<boolean | undefined>;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath] = useFormDataAtPath(path);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {schema.describe().meta?.title && (
        <strong>{schema.describe().meta?.title}: </strong>
      )}
      <span>{valueAtPath ? "True" : "False"}</span>
      {schema.describe().meta?.description && (
        <p style={{ fontSize: "small", color: "#666" }}>
          {schema.describe().meta?.description}
        </p>
      )}
    </div>
  );
};
