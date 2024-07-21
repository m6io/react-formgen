import React from "react";
import { z } from "zod";
import { useFormDataAtPath, useErrorsAtPath } from "../../..";

export const BooleanField: React.FC<{
  schema: z.ZodBoolean;
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
      {schema.description && <label>{schema.description}</label>}
      <input type="checkbox" checked={valueAtPath} onChange={handleChange} />
      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div key={index} style={{ color: "red" }}>
            {error.message}
          </div>
        ))}
    </div>
  );
};

export const BooleanDisplay: React.FC<{
  schema: z.ZodBoolean;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath] = useFormDataAtPath(path);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {schema.description && <strong>{schema.description}: </strong>}
      <span>{valueAtPath ? "True" : "False"}</span>
    </div>
  );
};
