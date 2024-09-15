import { JSONSchema7 } from "json-schema";
import { resolveSchema } from "./resolveSchema";

// Utility function to resolve $ref in JSON Schema
export const generateInitialData = (
  schema: JSONSchema7,
  definitions?: any,
  parentSchema?: JSONSchema7,
  propertyKey?: string
): any => {
  // Resolve any potential $ref schemas first
  schema = resolveSchema(schema, definitions);

  switch (schema.type) {
    case "object": {
      const obj: any = {};
      for (const key in schema.properties) {
        obj[key] = generateInitialData(
          schema.properties[key] as JSONSchema7,
          definitions,
          schema,
          key
        );
      }
      return obj;
    }
    case "array": {
      if (Array.isArray(schema.items)) {
        // Tuple case: schema.items is an array, so we treat each index individually
        const itemsSchemas = schema.items as JSONSchema7[];

        // If a default array exists, ensure it's valid
        if (Array.isArray(schema.default)) {
          const resultArray = [];
          for (let i = 0; i < itemsSchemas.length; i++) {
            const itemSchema = itemsSchemas[i];
            if (
              validateItemWithSchema(schema.default[i], itemSchema, definitions)
            ) {
              resultArray.push(schema.default[i]);
            } else {
              resultArray.push(
                generateInitialData(
                  itemSchema,
                  definitions,
                  schema,
                  propertyKey
                )
              );
            }
          }
          return resultArray;
        } else {
          // Check if the array property is required by its parent
          let isRequired = false;
          if (
            parentSchema &&
            propertyKey &&
            Array.isArray(parentSchema.required)
          ) {
            isRequired = parentSchema.required.includes(propertyKey);
          }

          if (isRequired) {
            // Generate initial data for each item schema
            const resultArray = [];
            // If any of the items have a default value, then
            // iterate over each item schema and generate initial data
            if (itemsSchemas.some((itemSchema) => itemSchema.default)) {
              for (const itemSchema of itemsSchemas) {
                resultArray.push(
                  generateInitialData(
                    itemSchema,
                    definitions,
                    schema,
                    propertyKey
                  )
                );
              }
            }
            return resultArray;
          } else {
            // Property is not required, so return undefined
            return undefined;
          }
        }
      } else {
        // Standard array case where all items have the same schema
        if (Array.isArray(schema.default)) {
          const itemsSchema = schema.items as JSONSchema7;
          const validItems = schema.default.filter((item) =>
            validateItemWithSchema(item, itemsSchema, definitions)
          );
          // Return the filtered array if there are valid items, else return an empty array
          return validItems.length > 0 ? validItems : [];
        }
        // If no valid default is found, return an empty array
        return [];
      }
    }
    case "string":
    case "number":
    case "integer":
    case "boolean":
    case "null":
      return schema.default || undefined;
    default:
      return schema.default || undefined;
  }
};

// Helper function to validate if an item matches the provided schema
const validateItemWithSchema = (
  item: any,
  schema: JSONSchema7,
  definitions?: any
): boolean => {
  schema = resolveSchema(schema, definitions);

  if (schema.type === "object") {
    if (typeof item !== "object" || item === null) return false;

    const properties = schema.properties || {};

    // Ensure no extraneous properties
    const itemKeys = Object.keys(item);
    const schemaKeys = Object.keys(properties);
    if (!itemKeys.every((key) => schemaKeys.includes(key))) return false;

    // Validate each property in the object
    for (const key in properties) {
      if (
        key in item &&
        !validateItemWithSchema(
          item[key],
          properties[key] as JSONSchema7,
          definitions
        )
      ) {
        return false;
      }
    }
    return true;
  }

  // Primitive types validation
  switch (schema.type) {
    case "string":
      return typeof item === "string";
    case "number":
      return typeof item === "number";
    case "integer":
      return Number.isInteger(item);
    case "boolean":
      return typeof item === "boolean";
    case "null":
      return item === null;
    case "array": {
      if (!Array.isArray(item)) return false;
      const itemsSchema = schema.items as JSONSchema7;
      return item.every((arrayItem) =>
        validateItemWithSchema(arrayItem, itemsSchema, definitions)
      );
    }
    default:
      return true;
  }
};
