import React from "react";
import { useFormContext } from "../context/useFormContext";

// Error Message Component Template
export const ErrorMessage: React.FC<{
  path: string[];
}> = ({ path }) => {
  const errors = useFormContext((state) => state.errors);
  if (!errors) return null;

  const fullPath = `/${path.join("/")}`;
  const error = errors.find((error) => {
    if (error.instancePath === fullPath) {
      return true;
    }
    if (error.keyword === "required" && error.params.missingProperty) {
      const missingPath = `${error.instancePath}/${error.params.missingProperty}`;
      return missingPath === fullPath;
    }
    return false;
  });

  if (!error) return null;

  return <div style={{ color: "red" }}>{error.message}</div>;
};
