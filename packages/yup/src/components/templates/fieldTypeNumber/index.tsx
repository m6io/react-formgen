import React from "react";
import * as Yup from "yup";
import { useFormDataAtPath, useErrorsAtPath } from "../../..";

// Number Field Component Template
export const NumberField: React.FC<{
  schema: Yup.NumberSchema<number | undefined>;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAtPath(event.target.value ? Number(event.target.value) : null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      <input
        type="number"
        value={valueAtPath ?? ""}
        onChange={handleChange}
        placeholder={schema.describe().meta?.title || ""}
      />
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

// Number Display Component Template
export const NumberDisplay: React.FC<{
  schema: Yup.NumberSchema<number | undefined>;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath] = useFormDataAtPath(path);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {schema.describe().meta?.title && (
        <strong>{schema.describe().meta?.title}: </strong>
      )}
      <span>{valueAtPath ?? "N/A"}</span>
      {schema.describe().meta?.description && (
        <p style={{ fontSize: "small", color: "#666" }}>
          {schema.describe().meta?.description}
        </p>
      )}
    </div>
  );
};
