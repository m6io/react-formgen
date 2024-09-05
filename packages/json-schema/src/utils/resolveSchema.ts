import { JSONSchema7 } from "json-schema";

// Utility function to resolve $ref in JSON Schema
export const resolveSchema = (
  schema: JSONSchema7,
  definitions: any
): JSONSchema7 => {
  if (schema.$ref) {
    try {
      const refPath = schema.$ref.replace("#/definitions/", "").split("/");
      let resolvedSchema: any = definitions;
      for (const part of refPath) {
        resolvedSchema = resolvedSchema[part];
        if (!resolvedSchema) {
          throw new Error(`Could not resolve reference: ${schema.$ref}`);
        }
      }
      return resolvedSchema;
    } catch (error) {
      console.error("Error resolving schema reference:", error);
      // Return the unresolved schema to avoid runtime issues.
      return schema;
    }
  }
  return schema;
};
