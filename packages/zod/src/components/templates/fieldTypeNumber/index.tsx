import React from "react";
import { z } from "zod";
import { useFormDataAtPath, useErrorsAtPath } from "../../../hooks";

export const NumberField: React.FC<{
  schema: z.ZodNumber;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAtPath(event.target.value ? Number(event.target.value) : null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {schema.description && <label>{schema.description}</label>}
      <input
        type="number"
        value={valueAtPath ?? ""}
        onChange={handleChange}
        placeholder={schema.description || ""}
      />
      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div key={index} style={{ color: "red" }}>
            {error.message}
          </div>
        ))}
    </div>
  );
};

export const NumberDisplay: React.FC<{
  schema: z.ZodNumber;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath] = useFormDataAtPath(path);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {schema.description && <strong>{schema.description}: </strong>}
      <span>{valueAtPath ?? "N/A"}</span>
    </div>
  );
};
