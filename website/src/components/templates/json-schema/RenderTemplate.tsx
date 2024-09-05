import React, { useState } from "react";
import {
  BaseArraySchema,
  BaseObjectSchema,
  BooleanSchema,
  NumberSchema,
  RenderTemplateProps,
  StringSchema,
  resolveSchema,
  FormState,
  useFormContext,
  useTemplates,
} from "@react-formgen/json-schema";

export const RenderTemplate: React.FC<RenderTemplateProps> = ({
  schema,
  path,
}) => {
  const [resolved, setResolved] = useState(false);
  const definitions = useFormContext(
    (state: FormState) => state.schema.definitions || {}
  );
  const {
    StringTemplate,
    NumberTemplate,
    BooleanTemplate,
    ObjectTemplate,
    ArrayTemplate,
  } = useTemplates();

  if (!resolved && schema.$ref) {
    return (
      <button onClick={() => setResolved(true)}>Click To Resolve Schema</button>
    );
  }

  try {
    schema = resolveSchema(schema, definitions);
  } catch (error) {
    console.error("Error resolving schema:", error);
    return <div>Failed to resolve schema at path: {path.join("/")}</div>;
  }

  switch (schema.type) {
    case "string":
      return <StringTemplate schema={schema as StringSchema} path={path} />;
    case "integer":
    case "number":
      return <NumberTemplate schema={schema as NumberSchema} path={path} />;
    case "boolean":
      return <BooleanTemplate schema={schema as BooleanSchema} path={path} />;
    case "null":
      return <input type="text" value="null" disabled />;
    case "object":
      return <ObjectTemplate schema={schema as BaseObjectSchema} path={path} />;
    case "array":
      return <ArrayTemplate schema={schema as BaseArraySchema} path={path} />;
    default:
      console.error(`Unsupported schema type "${schema.type}" at path:`, path);
      return (
        <div
          style={{
            color: "red",
            display: "flex",
            flexDirection: "column",
            border: "1px dashed red",
            padding: "1rem",
          }}
        >
          <strong>ERROR:</strong>
          <small>
            Unsupported schema type `{schema.type || "UNKNOWN"}` at path: `
            {path.join("/")}`
          </small>
        </div>
      );
  }
};
