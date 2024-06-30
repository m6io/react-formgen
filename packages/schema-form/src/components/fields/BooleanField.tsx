import React from "react";
import { BaseBooleanSchema } from "../types";
import { useFieldData, useFieldErrors } from "../../context/useFormContext";

// Boolean Field Component Template
export const BooleanField: React.FC<{
  schema: BaseBooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFieldData(path);
  const errorsAtPath = useFieldErrors(path);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAtPath(event.target.checked);
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
