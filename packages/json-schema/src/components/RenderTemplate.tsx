import React from "react";
import {
  BaseArraySchema,
  BaseObjectSchema,
  BooleanSchema,
  NumberSchema,
  RenderTemplateProps,
  StringSchema,
} from "./types";
import { resolveRef } from "../utils";

/**
 * Render a template based on the schema type.
 * @param {RenderTemplateProps} props - The props for the RenderTemplate.
 * @returns {JSX.Element} The template component.
 */
export const RenderTemplate: React.FC<RenderTemplateProps> = ({
  schema,
  path,
  definitions,
  fieldTemplates,
  readOnly = false,
}) => {
  schema = resolveRef(schema, definitions);

  switch (schema.type) {
    case "string":
      return readOnly ? (
        <fieldTemplates.StringDisplay
          schema={schema as StringSchema}
          path={path}
        />
      ) : (
        <fieldTemplates.StringField
          schema={schema as StringSchema}
          path={path}
        />
      );
    case "integer":
    case "number":
      return readOnly ? (
        <fieldTemplates.NumberDisplay
          schema={schema as NumberSchema}
          path={path}
        />
      ) : (
        <fieldTemplates.NumberField
          schema={schema as NumberSchema}
          path={path}
        />
      );
    case "boolean":
      return readOnly ? (
        <fieldTemplates.BooleanDisplay
          schema={schema as BooleanSchema}
          path={path}
        />
      ) : (
        <fieldTemplates.BooleanField
          schema={schema as BooleanSchema}
          path={path}
        />
      );
    case "null":
      return <input type="text" value="null" disabled />;
    case "object":
      return readOnly ? (
        <fieldTemplates.ObjectDisplay
          schema={schema as BaseObjectSchema}
          path={path}
          definitions={definitions}
          fieldTemplates={fieldTemplates}
        />
      ) : (
        <fieldTemplates.ObjectFieldset
          schema={schema as BaseObjectSchema}
          path={path}
          definitions={definitions}
          fieldTemplates={fieldTemplates}
        />
      );
    case "array":
      return readOnly ? (
        <fieldTemplates.ArrayDisplay
          schema={schema as BaseArraySchema}
          path={path}
          definitions={definitions}
          fieldTemplates={fieldTemplates}
        />
      ) : (
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
