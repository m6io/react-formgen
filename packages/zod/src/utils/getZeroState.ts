import { z, ZodFirstPartySchemaTypes } from "zod";

// Utility function to get zero state based on schema type
export const getZeroState = (schema: z.ZodType<any>): any => {
  const resolvedSchema = schema as ZodFirstPartySchemaTypes;

  switch (resolvedSchema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodString:
      return undefined;
    case z.ZodFirstPartyTypeKind.ZodNumber:
    case z.ZodFirstPartyTypeKind.ZodBigInt:
      return undefined;
    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return undefined;
    case z.ZodFirstPartyTypeKind.ZodNull:
      return null;
    case z.ZodFirstPartyTypeKind.ZodObject: {
      const obj: any = {};
      const shape = (resolvedSchema as z.ZodObject<any>).shape;
      for (const key in shape) {
        obj[key] = getZeroState(shape[key]);
      }
      return obj;
    }
    case z.ZodFirstPartyTypeKind.ZodArray:
      return [];
    case z.ZodFirstPartyTypeKind.ZodOptional:
      return getZeroState(
        (resolvedSchema as z.ZodOptional<any>)._def.innerType
      );
    case z.ZodFirstPartyTypeKind.ZodNullable:
      return getZeroState(
        (resolvedSchema as z.ZodNullable<any>)._def.innerType
      );
    default:
      return undefined;
  }
};
