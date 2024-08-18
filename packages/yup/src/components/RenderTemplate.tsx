import React from "react";
import * as Yup from "yup";
import { RenderTemplateProps } from "./types";
import { resolveSchema } from "../utils/resolveSchema";
import { useTemplates } from "..";

const {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  ArraySchema,
  DateSchema,
} = Yup;

export const RenderTemplate: React.FC<RenderTemplateProps> = ({
  schema,
  path,
}) => {
  const {
    StringTemplate,
    NumberTemplate,
    BooleanTemplate,
    ObjectTemplate,
    ArrayTemplate,
  } = useTemplates();
  const resolvedSchema = resolveSchema(schema);

  if (
    resolvedSchema instanceof StringSchema ||
    resolvedSchema instanceof DateSchema
  ) {
    return <StringTemplate schema={resolvedSchema} path={path} />;
  } else if (resolvedSchema instanceof NumberSchema) {
    return <NumberTemplate schema={resolvedSchema} path={path} />;
  } else if (resolvedSchema instanceof BooleanSchema) {
    return <BooleanTemplate schema={resolvedSchema} path={path} />;
  } else if (resolvedSchema instanceof ObjectSchema) {
    return <ObjectTemplate schema={resolvedSchema} path={path} />;
  } else if (resolvedSchema instanceof ArraySchema) {
    return <ArrayTemplate schema={resolvedSchema} path={path} />;
  } else {
    return null;
  }
};
