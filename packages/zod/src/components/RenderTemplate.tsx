import React from "react";
import { z } from "zod";
import { RenderTemplateProps } from "./types";
import { mapToPrimaryType, resolveSchema } from "../utils/resolveSchema";
import { useTemplates } from "..";

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
  const resolvedSchema = mapToPrimaryType(resolveSchema(schema));

  if (
    resolvedSchema instanceof z.ZodString ||
    resolvedSchema instanceof z.ZodDate ||
    resolvedSchema instanceof z.ZodEnum
  ) {
    return <StringTemplate schema={resolvedSchema} path={path} />;
  } else if (resolvedSchema instanceof z.ZodNumber) {
    return <NumberTemplate schema={resolvedSchema} path={path} />;
  } else if (resolvedSchema instanceof z.ZodBoolean) {
    return <BooleanTemplate schema={resolvedSchema} path={path} />;
  } else if (resolvedSchema instanceof z.ZodObject) {
    return <ObjectTemplate schema={resolvedSchema} path={path} />;
  } else if (resolvedSchema instanceof z.ZodArray) {
    return <ArrayTemplate schema={resolvedSchema} path={path} />;
  } else {
    console.error(
      `Unsupported schema type: ${resolvedSchema._def.typeName} at path: ${path}`
    );
    return null;
  }
};
