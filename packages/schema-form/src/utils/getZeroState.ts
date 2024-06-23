import { JSONSchema7 } from "json-schema";
import { resolveRef } from "./resolveRef";

// Utility function to get zero state based on schema type
export const getZeroState = (schema: JSONSchema7, definitions?: any): any => {
  if (schema.$ref && definitions) {
    schema = resolveRef(schema, definitions);
  }

  switch (schema.type) {
    case "string":
      return schema.default || undefined;
    case "integer":
    case "number":
      return schema.default || undefined;
    case "boolean":
      return schema.default || undefined;
    case "null":
      return null;
    case "object": {
      const obj: any = {};
      Object.keys(schema.properties || {}).forEach((key) => {
        obj[key] = definitions
          ? getZeroState(schema.properties?.[key] as JSONSchema7, definitions)
          : getZeroState(schema.properties?.[key] as JSONSchema7);
      });
      return obj;
    }
    case "array":
      return [];
    default:
      return "";
  }
};
