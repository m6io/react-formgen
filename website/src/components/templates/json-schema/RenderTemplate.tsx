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

  if (schema.$ref) {
    schema = resolveSchema(schema, definitions);
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
      return null;
  }
};
