import React from "react";
import { useFormContext } from "../context/useFormContext";
import { BooleanSchema } from "./types";
import { ErrorMessage } from "./index";

// Boolean Field Component Template
export const BooleanField: React.FC<{
  schema: BooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? false;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.checked);
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
      <ErrorMessage path={path} />
    </div>
  );
};
