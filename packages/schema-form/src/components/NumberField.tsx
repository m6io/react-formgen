import React from "react";
import { useFormContext } from "../context/useFormContext";
import { ErrorMessage } from "./ErrorMessage";
import { NumberSchema } from "./types";

// Number Field Component Template
export const NumberField: React.FC<{
  schema: NumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? null;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.value ? Number(event.target.value) : null);
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
        style={{ width: "100px" }}
      />
      {schema.description && <small>{schema.description}</small>}
      {Array.isArray(schema.examples) && (
        <datalist id={`${path.join("-")}-datalist`}>
          {schema.examples.map((example, index) => (
            <option key={index} value={example as number} />
          ))}
        </datalist>
      )}
      <ErrorMessage path={path} />
    </div>
  );
};
