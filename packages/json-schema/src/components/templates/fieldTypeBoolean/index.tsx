import React from "react";
import { BaseBooleanSchema } from "../../types";
import { useFormDataAtPath, useErrorsAtPath } from "../../../hooks";

// Boolean Field Component Template
export const BooleanField: React.FC<{
  schema: BaseBooleanSchema;
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
      {schema.title && <label>{schema.title}</label>}
      <input type="checkbox" checked={valueAtPath} onChange={handleChange} />
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

// Boolean Display Component Template
export const BooleanDisplay: React.FC<{
  schema: BaseBooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath] = useFormDataAtPath(path);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {schema.title && <strong>{schema.title}: </strong>}
      <span>{valueAtPath ? "True" : "False"}</span>
      {schema.description && (
        <p style={{ fontSize: "small", color: "#666" }}>{schema.description}</p>
      )}
    </div>
  );
};
