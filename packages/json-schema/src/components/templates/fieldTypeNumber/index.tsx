import React from "react";
import { BaseNumberSchema } from "../../types";
import { useFormDataAtPath, useErrorsAtPath } from "../../..";

// Number Field Component Template
export const NumberField: React.FC<{
  schema: BaseNumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAtPath(event.target.value ? Number(event.target.value) : null);
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

// Number Display Component Template
export const NumberDisplay: React.FC<{
  schema: BaseNumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath] = useFormDataAtPath(path);

  return (
    <div style={{ marginBottom: "1rem" }}>
      {schema.title && <strong>{schema.title}: </strong>}
      <span>{valueAtPath ?? "N/A"}</span>
      {schema.description && (
        <p style={{ fontSize: "small", color: "#666" }}>{schema.description}</p>
      )}
    </div>
  );
};
