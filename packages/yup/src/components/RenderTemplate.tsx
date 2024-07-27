import React from "react";
import * as Yup from "yup";
import { RenderTemplateProps } from "./types";
import { resolveSchema } from "../utils/resolveSchema";

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
  fieldTemplates,
  readOnly = false,
}) => {
  const resolvedSchema = resolveSchema(schema);

  if (
    resolvedSchema instanceof StringSchema ||
    resolvedSchema instanceof DateSchema
  ) {
    return readOnly ? (
      <fieldTemplates.StringDisplay schema={resolvedSchema} path={path} />
    ) : (
      <fieldTemplates.StringField schema={resolvedSchema} path={path} />
    );
  } else if (resolvedSchema instanceof NumberSchema) {
    return readOnly ? (
      <fieldTemplates.NumberDisplay schema={resolvedSchema} path={path} />
    ) : (
      <fieldTemplates.NumberField schema={resolvedSchema} path={path} />
    );
  } else if (resolvedSchema instanceof BooleanSchema) {
    return readOnly ? (
      <fieldTemplates.BooleanDisplay schema={resolvedSchema} path={path} />
    ) : (
      <fieldTemplates.BooleanField schema={resolvedSchema} path={path} />
    );
  } else if (resolvedSchema instanceof ObjectSchema) {
    return readOnly ? (
      <fieldTemplates.ObjectDisplay
        schema={resolvedSchema}
        path={path}
        fieldTemplates={fieldTemplates}
      />
    ) : (
      <fieldTemplates.ObjectFieldset
        schema={resolvedSchema}
        path={path}
        fieldTemplates={fieldTemplates}
      />
    );
  } else if (resolvedSchema instanceof ArraySchema) {
    return readOnly ? (
      <fieldTemplates.ArrayDisplay
        schema={resolvedSchema}
        path={path}
        fieldTemplates={fieldTemplates}
      />
    ) : (
      <fieldTemplates.ArrayFieldset
        schema={resolvedSchema}
        path={path}
        fieldTemplates={fieldTemplates}
      />
    );
  } else {
    return null;
  }
};
