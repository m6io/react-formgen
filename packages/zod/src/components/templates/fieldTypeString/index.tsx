import React from "react";
import { z } from "zod";
import { useFormDataAtPath, useErrorsAtPath } from "../../../hooks";

export const StringField: React.FC<{
  schema: z.ZodString;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAtPath(event.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {schema.description && <label>{schema.description}</label>}
      <input
        type="text"
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

export const StringDisplay: React.FC<{
  schema: z.ZodString;
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
