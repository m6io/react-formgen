import type * as z from "zod/v4/core";

/**
 * Schema visitor that recursively unwraps wrapper types to get to the core schema
 * @param schema - The Zod schema to unwrap
 * @returns The innermost non-wrapper schema
 */
export function unwrapSchema(schema: z.$ZodType): z.$ZodTypes {
  const typedSchema = schema as z.$ZodTypes;
  const def = typedSchema._zod.def;

  switch (def.type) {
    case "optional": {
      const optionalSchema = typedSchema as z.$ZodOptional;
      return unwrapSchema(optionalSchema._zod.def.innerType);
    }

    case "nullable": {
      const nullableSchema = typedSchema as z.$ZodNullable;
      return unwrapSchema(nullableSchema._zod.def.innerType);
    }

    case "default": {
      const defaultSchema = typedSchema as z.$ZodDefault;
      return unwrapSchema(defaultSchema._zod.def.innerType);
    }

    case "prefault": {
      const prefaultSchema = typedSchema as z.$ZodDefault;
      return unwrapSchema(prefaultSchema._zod.def.innerType);
    }

    case "readonly": {
      const readonlySchema = typedSchema as z.$ZodReadonly;
      return unwrapSchema(readonlySchema._zod.def.innerType);
    }

    case "nonoptional": {
      const nonOptionalSchema = typedSchema as z.$ZodNonOptional;
      return unwrapSchema(nonOptionalSchema._zod.def.innerType);
    }

    case "lazy": {
      const lazySchema = typedSchema as z.$ZodLazy;
      const actualSchema = lazySchema._zod.def.getter();
      return unwrapSchema(actualSchema);
    }

    default:
      return typedSchema;
  }
}
