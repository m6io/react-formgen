import { JSONSchema7 } from "json-schema";

// Utility function to resolve $ref in JSON Schema
export const resolveRef = (
  schema: JSONSchema7,
  definitions: any
): JSONSchema7 => {
  if (schema.$ref) {
    const refPath = schema.$ref.replace("#/definitions/", "").split("/");
    let resolvedSchema: any = definitions;
    for (const part of refPath) {
      resolvedSchema = resolvedSchema[part];
      if (!resolvedSchema) {
        throw new Error(`Could not resolve reference: ${schema.$ref}`);
      }
    }
    return resolvedSchema;
  }
  return schema;
};
