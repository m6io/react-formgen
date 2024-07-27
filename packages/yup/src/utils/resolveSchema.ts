import * as Yup from "yup";

// Helper function to resolve Lazy schemas
export const resolveSchema = (schema: Yup.AnySchema): Yup.AnySchema => {
  let resolvedSchema = schema as Yup.AnySchema;

  // Recursively resolve lazy schemas
  while (resolvedSchema.type === "lazy") {
    resolvedSchema = resolvedSchema.resolve({});
  }

  return resolvedSchema;
};
