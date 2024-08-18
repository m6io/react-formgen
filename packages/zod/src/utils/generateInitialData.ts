import { z, ZodTypeAny } from "zod";

// Utility function to get initial data based on schema type
export const generateInitialData = (schema: ZodTypeAny): any => {
  // Unwrap and resolve defaults within a single function
  while (
    schema instanceof z.ZodEffects ||
    schema instanceof z.ZodDefault ||
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable
  ) {
    if (schema instanceof z.ZodEffects) {
      schema = schema._def.schema;
    } else if (schema instanceof z.ZodDefault) {
      return schema._def.defaultValue(); // Return the default value
    } else if (
      schema instanceof z.ZodOptional ||
      schema instanceof z.ZodNullable
    ) {
      schema = schema._def.innerType;
    }
  }

  // Now resolve based on the unwrapped schema type
  if (schema instanceof z.ZodString) {
    return undefined;
  } else if (schema instanceof z.ZodNumber) {
    return undefined;
  } else if (schema instanceof z.ZodBoolean) {
    return undefined;
  } else if (schema instanceof z.ZodDate) {
    return undefined;
  } else if (schema instanceof z.ZodLiteral) {
    return schema._def.value;
  } else if (schema instanceof z.ZodEnum) {
    return undefined; // or schema._def.values[0] if you prefer
  } else if (schema instanceof z.ZodArray) {
    return [];
  } else if (schema instanceof z.ZodObject) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(schema.shape)) {
      result[key] = generateInitialData(value as ZodTypeAny);
    }
    return result;
  } else {
    console.error(`Unsupported schema type: ${schema._def.typeName}`);
    return undefined;
  }
};
