import { JSONSchema7 } from "json-schema";
import { resolveSchema } from "./resolveSchema";

// Utility function to resolve $ref in JSON Schema
export const generateInitialData = (
  schema: JSONSchema7,
  definitions?: any
): any => {
  schema = resolveSchema(schema, definitions);

  switch (schema.type) {
    case "object": {
      const obj: any = {};
      for (const key in schema.properties) {
        obj[key] = generateInitialData(
          schema.properties[key] as JSONSchema7,
          definitions
        );
      }
      return obj;
    }
    case "array":
      return [];
    case "string":
      return schema.default || undefined;
    case "number":
    case "integer":
      return schema.default || undefined;
    case "boolean":
      return schema.default || undefined;
    case "null":
      return schema.default || undefined;
    default:
      return schema.default || undefined;
  }
};
