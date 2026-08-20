import React from "react";
import type * as z from "zod/v4/core";
import { RenderTemplateProps } from "./types";
import { useTemplates } from "..";
import { unwrapSchema } from "../utils";

/**
 * Render a template based on the schema type.
 * @param {RenderTemplateProps} props - The props for the RenderTemplate.
 * @returns {JSX.Element} The rendered template component.
 */
export const RenderTemplate: React.FC<RenderTemplateProps> = ({
  schema,
  path,
}) => {
  // Grab custom or default templates from context.
  const {
    StringTemplate,
    NumberTemplate,
    BooleanTemplate,
    BigIntTemplate,
    DateTemplate,
    ArrayTemplate,
    ObjectTemplate,
    UnionTemplate,
    TupleTemplate,
    EnumTemplate,
    LiteralTemplate,
  } = useTemplates();

  // Let's first unwrap the schema to get to the core type
  const coreSchema = unwrapSchema(schema);

  const def = coreSchema._zod.def;

  switch (def.type) {
    case "string":
      return <StringTemplate schema={schema} path={path} />;

    case "number":
      return <NumberTemplate schema={schema} path={path} />;

    case "boolean":
      return <BooleanTemplate schema={schema} path={path} />;

    case "bigint":
      return <BigIntTemplate schema={schema} path={path} />;

    case "date":
      return <DateTemplate schema={schema} path={path} />;

    case "object":
      return <ObjectTemplate schema={schema} path={path} />;

    case "array":
      return <ArrayTemplate schema={schema} path={path} />;

    case "enum":
      return <EnumTemplate schema={schema} path={path} />;

    case "union":
      return <UnionTemplate schema={schema} path={path} />;

    case "tuple":
      return <TupleTemplate schema={schema} path={path} />;

    case "literal":
      return <LiteralTemplate schema={schema} path={path} />;

    case "lazy": {
      // Lazy schemas contain a getter function that returns the actual schema
      const lazySchema = coreSchema as z.$ZodLazy;
      const actualSchema = lazySchema._zod.def.getter();
      // Recursively render the actual schema
      return <RenderTemplate schema={actualSchema} path={path} />;
    }

    default:
      // Unknown or unsupported schema type
      console.error(
        `Unsupported schema type: ${def.type} at path: ${path.join("/")}`
      );
      // For debugging during development
      // return (
      //   <div
      //     style={{
      //       color: "red",
      //       display: "flex",
      //       flexDirection: "column",
      //       border: "1px dashed red",
      //       padding: "1rem",
      //     }}
      //   >
      //     <strong>ERROR:</strong>
      //     <small>
      //       Unsupported schema type `{def.type || "UNKNOWN"}` at path: `
      //       {path.join("/")}`
      //     </small>
      //   </div>
      // );
      return null;
  }
};
