import * as Yup from "yup";
import { resolveSchema } from "./resolveSchema";

export const getZeroState = (schema: Yup.AnySchema): any => {
  const resolvedSchema = resolveSchema(schema) as Yup.AnySchema;

  if (resolvedSchema instanceof Yup.StringSchema) {
    return undefined;
  } else if (resolvedSchema instanceof Yup.NumberSchema) {
    return undefined;
  } else if (resolvedSchema instanceof Yup.BooleanSchema) {
    return undefined;
  } else if (resolvedSchema instanceof Yup.ObjectSchema) {
    const obj: any = {};
    Object.keys(resolvedSchema.fields).forEach((key) => {
      obj[key] = getZeroState(resolvedSchema.fields[key] as Yup.AnySchema);
    });
    return obj;
  } else if (resolvedSchema instanceof Yup.ArraySchema) {
    return [];
  } else {
    return undefined;
  }
};
