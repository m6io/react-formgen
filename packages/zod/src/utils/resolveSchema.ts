import { z, ZodFirstPartySchemaTypes } from "zod";

export const resolveSchema = (
  schema: z.ZodType<any>
): ZodFirstPartySchemaTypes => {
  let resolvedSchema = schema as ZodFirstPartySchemaTypes;

  while (
    resolvedSchema._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional ||
    resolvedSchema._def.typeName === z.ZodFirstPartyTypeKind.ZodNullable ||
    resolvedSchema._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault
  ) {
    resolvedSchema = resolvedSchema._def.innerType as ZodFirstPartySchemaTypes;
  }

  return resolvedSchema;
};

export const mapToPrimaryType = (
  schema: ZodFirstPartySchemaTypes
): ZodFirstPartySchemaTypes => {
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
