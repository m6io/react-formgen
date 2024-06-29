import { JSONSchema7 } from "json-schema";

type SchemaDefinitions = JSONSchema7["definitions"];

/**
 * Custom OneOf type for string fields.
 * @typedef {Object} StringOneOf
 * @property {string} const - The value of the string field.
 * @property {string} title - The title of the string field.
 *
 */
type StringOneOf = {
  const: string;
  title: string;
};

/**
 * Represents a base string schema. This is used as a base for the StringSchema type, for instances where the constraints are not needed.
 * @typedef {Object} BaseStringSchema
 * @extends {JSONSchema7}
 * @property {"string"} type - The type of the schema.
 */
interface BaseStringSchema extends JSONSchema7 {
  type: "string";
}

/**
 * Represents the recommended string schema with additional UI options.
 * @typedef {Object} StringSchema
 * @extends {BaseStringSchema}
 * @property {"string"} type - The type of the schema.
 * @property {StringOneOf[]} [oneOf] - The oneOf options for the string field.
 * @property {StringOneOf[]} [enum] - The enum options for the string field.
 * @property {string} [uiSchema] - The UI schema for the string field.
 *
 */
interface StringSchema extends BaseStringSchema {
  enum?: string[];
  oneOf?: StringOneOf[];
  uiSchema?: string;
}

// Types for number schema
interface NumberSchema extends JSONSchema7 {
  type: "number" | "integer";
}

/**
 * Custom OneOf type for boolean fields.
 * @typedef {Object} BooleanOneOf
 * @property {boolean} const - The value of the boolean field.
 * @property {string} title - The title of the boolean field.
 *
 */
type BooleanOneOf = {
  const: boolean;
  title: string;
};

/**
 * Represents a base boolean schema. This is used as a base for the BooleanSchema type, for instances where the constraints are not needed.
 * @typedef {Object} BaseBooleanSchema
 * @extends {JSONSchema7}
 * @property {"boolean"} type - The type of the schema.
 */

interface BaseBooleanSchema extends JSONSchema7 {
  type: "boolean";
}

/**
 * Represents the recommended boolean schema with additional UI options.
 * @typedef {Object} BooleanSchema
 * @extends {BaseBooleanSchema}
 * @property {BooleanOneOf[]} oneOf - The oneOf options for the boolean field.
 * @property {string} [uiSchema] - The UI schema for the string field.
 *
 */
interface BooleanSchema extends BaseBooleanSchema {
  oneOf?: BooleanOneOf[];
  uiSchema?: string;
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
  StringField?: React.FC<{ schema: StringSchema; path: string[] }>;
  BaseStringField?: React.FC<{ schema: BaseStringSchema; path: string[] }>;
  NumberField?: React.FC<{ schema: NumberSchema; path: string[] }>;
  BooleanField?: React.FC<{ schema: BooleanSchema; path: string[] }>;
  BaseBooleanField?: React.FC<{ schema: BaseBooleanSchema; path: string[] }>;
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
  BaseStringSchema,
  StringOneOf,
  StringSchema,
  NumberSchema,
  BaseBooleanSchema,
  BooleanOneOf,
  BooleanSchema,
  ObjectSchema,
  ArraySchema,
  CustomFields,
  SchemaDefinitions,
};
