import { z } from "zod";
import { mapToPrimaryType, resolveSchema } from "./resolveSchema";

// Utility function to get initial data based on schema type
export const generateInitialData = (schema: z.ZodType<any>): any => {
  const resolvedSchema = mapToPrimaryType(resolveSchema(schema));

  switch (resolvedSchema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodObject: {
      const obj: any = {};
      const shape = (resolvedSchema as z.ZodObject<any>).shape;
      for (const key in shape) {
        obj[key] = generateInitialData(shape[key]);
      }
      return obj;
    }
    case z.ZodFirstPartyTypeKind.ZodArray:
      return [];
    case z.ZodFirstPartyTypeKind.ZodString:
    case z.ZodFirstPartyTypeKind.ZodNumber:
    case z.ZodFirstPartyTypeKind.ZodBoolean:
    case z.ZodFirstPartyTypeKind.ZodNull:
      return undefined;
    case z.ZodFirstPartyTypeKind.ZodOptional:
      return generateInitialData(
        (resolvedSchema as z.ZodOptional<any>)._def.innerType
      );
    case z.ZodFirstPartyTypeKind.ZodNullable:
      return generateInitialData(
        (resolvedSchema as z.ZodNullable<any>)._def.innerType
      );
    default:
      return undefined;
  }
};
