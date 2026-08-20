import type * as z from "zod/v4/core";
import { getDefaultValue } from "./getDefaultValue";
import { isOptional } from "./isOptional";
import { unwrapSchema } from "./unwrapSchema";

/**
 * Represents the possible zero state values that can be extracted from a schema
 */
type ZeroState =
  | string
  | number
  | boolean
  | bigint
  | Date
  | unknown[]
  | undefined
  | unknown;

/**
 * Extracts a zero state value from a Zod 4 schema
 * @param schema - The Zod schema to extract zero state from
 * @returns The zero state value for the schema
 */
export function generateInitialData(schema: z.$ZodType): ZeroState {
  // First check for default values
  const defaultValue = getDefaultValue(schema);
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  // Check if optional (return undefined for optional fields without defaults)
  if (isOptional(schema)) {
    // I'm still unsure about how to best handle optional Zod schemas when generating initial data. Keeping this for now for debugging purposes.
    // const coreSchema = unwrapSchema(schema)
    // console.log(
    //   `Schema ${coreSchema._zod.def.type} / ${JSON.stringify(coreSchema, null, 2)} is optional, returning undefined`,
    // )

    return undefined;
  }

  // Unwrap to get to the core schema type
  const coreSchema = unwrapSchema(schema);
  const def = coreSchema._zod.def;

  switch (def.type) {
    case "string":
    case "number":
    case "boolean":
    case "bigint":
    case "date":
      return undefined;

    case "array": {
      const arraySchema = coreSchema as z.$ZodArray;
      const minCheck = arraySchema._zod.def.checks?.find(
        (check) => check._zod.def.check === "min_size"
      ) as z.$ZodCheckMinSize | undefined;

      if (minCheck) {
        const minSize = minCheck._zod.def.minimum;
        const elementZeroState = generateInitialData(
          arraySchema._zod.def.element
        );
        return Array(minSize).fill(elementZeroState);
      }

      return [];
    }

    case "object": {
      const objectSchema = coreSchema as z.$ZodObject;
      const shape = objectSchema._zod.def.shape;
      const result: Record<string, unknown> = {};

      for (const [key, fieldSchema] of Object.entries(shape)) {
        const fieldZeroState = generateInitialData(fieldSchema as z.$ZodType);
        if (fieldZeroState !== undefined) {
          result[key] = fieldZeroState;
        }
      }

      return result;
    }

    case "union": {
      const unionSchema = coreSchema as z.$ZodUnion;
      const firstOption = unionSchema._zod.def.options[0];
      return firstOption ? generateInitialData(firstOption) : undefined;
    }

    case "tuple": {
      const tupleSchema = coreSchema as z.$ZodTuple;
      return tupleSchema._zod.def.items.map((item) =>
        generateInitialData(item)
      );
    }

    case "enum": {
      const enumSchema = coreSchema as z.$ZodEnum;
      const enumDef = enumSchema._zod.def as z.$ZodEnumDef;
      // Get the first key from the enum entries object
      const firstKey = Object.keys(enumDef.entries)[0];
      return enumDef.entries[firstKey];
    }

    case "literal": {
      const literalSchema = coreSchema as z.$ZodLiteral;
      return Array.from(literalSchema._zod.def.values)[0];
    }

    case "lazy": {
      // Lazy schemas contain a getter function that returns the actual schema
      const lazySchema = coreSchema as z.$ZodLazy;
      const actualSchema = lazySchema._zod.def.getter();
      // Recursively generate initial data for the actual schema
      return generateInitialData(actualSchema);
    }

    default:
      console.error(`Unsupported schema type: ${def.type}`);
      return undefined;
  }
}
