import { JSONSchema7 } from "json-schema";

type SchemaDefinitions = JSONSchema7["definitions"];

// Types for string schema
interface StringSchema extends JSONSchema7 {
  type: "string";
}

// Types for number schema
interface NumberSchema extends JSONSchema7 {
  type: "number" | "integer";
}

// Types for boolean schema
interface BooleanSchema extends JSONSchema7 {
  type: "boolean";
}

// Types for object schema
interface ObjectSchema extends JSONSchema7 {
  type: "object";
  properties: {
    [key: string]: JSONSchema7;
  };
}

// Types for array schema
interface ArraySchema extends JSONSchema7 {
  type: "array";
  items: JSONSchema7;
}

// Custom Fields Type
type CustomFields = {
  TextField?: React.FC<{ schema: StringSchema; path: string[] }>;
  NumberField?: React.FC<{ schema: NumberSchema; path: string[] }>;
  BooleanField?: React.FC<{ schema: BooleanSchema; path: string[] }>;
  ObjectField?: React.FC<{
    schema: ObjectSchema;
    path: string[];
    definitions: SchemaDefinitions;
    customFields?: CustomFields;
  }>;
  ArrayField?: React.FC<{
    schema: ArraySchema;
    path: string[];
    definitions: SchemaDefinitions;
    customFields?: CustomFields;
  }>;
};

export type {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  ArraySchema,
  CustomFields,
  SchemaDefinitions,
};
