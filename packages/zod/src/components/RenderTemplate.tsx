import React from "react";
import { RenderTemplateProps } from "./types";
import { z, ZodString, ZodNumber, ZodBoolean, ZodObject, ZodArray } from "zod";
import { mapToPrimaryType, resolveSchema } from "../utils/resolveSchema";

export const RenderTemplate: React.FC<RenderTemplateProps> = ({
  schema,
  path,
  fieldTemplates,
  readOnly = false,
}) => {
  const resolvedSchema = mapToPrimaryType(resolveSchema(schema));

  switch (resolvedSchema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodString:
      return readOnly ? (
        <fieldTemplates.StringDisplay
          schema={resolvedSchema as ZodString}
          path={path}
        />
      ) : (
        <fieldTemplates.StringField
          schema={resolvedSchema as ZodString}
          path={path}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return readOnly ? (
        <fieldTemplates.NumberDisplay
          schema={resolvedSchema as ZodNumber}
          path={path}
        />
      ) : (
        <fieldTemplates.NumberField
          schema={resolvedSchema as ZodNumber}
          path={path}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return readOnly ? (
        <fieldTemplates.BooleanDisplay
          schema={resolvedSchema as ZodBoolean}
          path={path}
        />
      ) : (
        <fieldTemplates.BooleanField
          schema={resolvedSchema as ZodBoolean}
          path={path}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodObject:
      return readOnly ? (
        <fieldTemplates.ObjectDisplay
          schema={resolvedSchema as ZodObject<any>}
          path={path}
          fieldTemplates={fieldTemplates}
        />
      ) : (
        <fieldTemplates.ObjectFieldset
          schema={resolvedSchema as ZodObject<any>}
          path={path}
          fieldTemplates={fieldTemplates}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodArray:
      return readOnly ? (
        <fieldTemplates.ArrayDisplay
          schema={resolvedSchema as ZodArray<any>}
          path={path}
          fieldTemplates={fieldTemplates}
        />
      ) : (
        <fieldTemplates.ArrayFieldset
          schema={resolvedSchema as ZodArray<any>}
          path={path}
          fieldTemplates={fieldTemplates}
        />
      );
    default:
      console.error(
        `Unsupported schema typeName: ${resolvedSchema._def.typeName} at path: ${path}`
      );

      return null;
  }
};
