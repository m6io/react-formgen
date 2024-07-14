import React from "react";
import { JSONSchema7 } from "json-schema";
import {
  BaseArraySchema,
  BaseObjectSchema,
  BooleanSchema,
  FieldTemplates,
  NumberSchema,
  SchemaDefinitions,
  StringSchema,
} from "@/components/types";
import { resolveRef } from "../utils/resolveRef";

export const RenderTemplate: React.FC<{
  schema: JSONSchema7;
  path: string[];
  definitions: SchemaDefinitions;
  fieldTemplates: FieldTemplates;
}> = ({ schema, path, definitions, fieldTemplates }) => {
  schema = resolveRef(schema, definitions);

  switch (schema.type) {
    case "string":
      return (
        <fieldTemplates.StringField
          schema={schema as StringSchema}
          path={path}
        />
      );
    case "integer":
    case "number":
      return (
        <fieldTemplates.NumberField
          schema={schema as NumberSchema}
          path={path}
        />
      );
    case "boolean":
      return (
        <fieldTemplates.BooleanField
          schema={schema as BooleanSchema}
          path={path}
        />
      );
    case "null":
      return <input type="text" value="null" disabled />;
    case "object":
      return (
        <fieldTemplates.ObjectFieldset
          schema={schema as BaseObjectSchema}
          path={path}
          definitions={definitions}
          fieldTemplates={fieldTemplates}
        />
      );
    case "array":
      return (
        <fieldTemplates.ArrayFieldset
          schema={schema as BaseArraySchema}
          path={path}
          definitions={definitions}
          fieldTemplates={fieldTemplates}
        />
      );
    default:
      return null;
  }
};
