import { z } from "zod";

// Helper function to resolve lazy schemas
export const resolveSchema = (
  schema: z.ZodTypeAny
): z.ZodFirstPartySchemaTypes => {
  let resolvedSchema = schema as z.ZodFirstPartySchemaTypes;

  // Recursively resolve lazy schemas
  while (resolvedSchema._def.typeName === z.ZodFirstPartyTypeKind.ZodLazy) {
    resolvedSchema = resolvedSchema._def.getter();
  }

  while (
    resolvedSchema._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional ||
    resolvedSchema._def.typeName === z.ZodFirstPartyTypeKind.ZodNullable ||
    resolvedSchema._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault
  ) {
    resolvedSchema = resolvedSchema._def
      .innerType as z.ZodFirstPartySchemaTypes;
  }

  return resolvedSchema;
};

export const mapToPrimaryType = (
  schema: z.ZodFirstPartySchemaTypes
): z.ZodFirstPartySchemaTypes => {
  switch (schema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodLiteral:
      return resolveSchema(schema);
    case z.ZodFirstPartyTypeKind.ZodEnum:
      return resolveSchema(schema);
    case z.ZodFirstPartyTypeKind.ZodUnion:
      return resolveSchema(schema._def.options[0]);
    case z.ZodFirstPartyTypeKind.ZodTuple:
      return resolveSchema(schema._def.items[0]);
    case z.ZodFirstPartyTypeKind.ZodEffects:
      return resolveSchema(schema._def.schema);
    default:
      return schema;
  }
};
