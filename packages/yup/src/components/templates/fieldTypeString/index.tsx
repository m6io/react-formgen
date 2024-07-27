import React from "react";
import * as Yup from "yup";
import { useFormDataAtPath, useErrorsAtPath } from "../../..";

// String Field Component Template
export const StringField: React.FC<{
  schema: Yup.StringSchema<string | undefined> | Yup.DateSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAtPath(event.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      <input
        type="text"
        value={valueAtPath ?? ""}
        onChange={handleChange}
        placeholder={schema.describe().meta?.title || ""}
        list={
          schema.describe().oneOf ? `${path.join("-")}-datalist` : undefined
        }
      />
      {schema.describe().meta?.description && (
        <small>{schema.describe().meta?.description}</small>
      )}
      {schema.describe().oneOf && (
        <datalist id={`${path.join("-")}-datalist`}>
          {schema.describe().oneOf.map((example: any, index) => (
            <option key={index} value={example.value as string} />
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

// String Display Component Template
export const StringDisplay: React.FC<{
  schema: Yup.StringSchema<string | undefined> | Yup.DateSchema;
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
