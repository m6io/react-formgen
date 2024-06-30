import { JSONSchema7 } from "json-schema";

type SchemaDefinitions = JSONSchema7["definitions"];

/**
 * Represents the UI schema for a field.
 * @typedef {Object} UISchema
 * @property {string} component - The component to use for the field.
 * @property {Object.<string, unknown>} props - The props to pass to the component.
 *
 */
type UISchema = {
  component: string;
  props: {
    [key: string]: unknown;
  };
};

/**
 * Custom OneOf type for string fields.
 * @typedef {Object} StringOneOf
 * @property {string} const - The value of the string field.
 * @property {string} title - The title of the string field.
 * @property {string} [description] - The description of the string field.
 *
 */
type StringOneOf = {
  const: string;
  title?: string;
  description?: string;
};

/**
 * Represents a base string schema. This is used as a base for the StringSchema type, for instances where the constraints are not needed.
 * @typedef {Object} BaseStringSchema
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"string"} type - The type of the schema.
 *
 */
interface BaseStringSchema extends Omit<JSONSchema7, "type"> {
  type: "string";
}

/**
 * Represents the recommended string schema with additional UI options.
 * @typedef {Object} StringSchema
 * @extends {Omit<JSONSchema7, "type" | "enum" | "oneOf">}
 * @property {"string"} type - The type of the schema.
 * @property {string[]} [enum] - The enum options for the string field. This is evaluated first before the oneOf options.
 * @property {StringOneOf[]} [oneOf] - The oneOf options for the string field.
 * @property {uiSchema} [UISchema] - The UI schema for the string field.
 *
 */
interface StringSchema extends Omit<JSONSchema7, "type" | "enum" | "oneOf"> {
  type: "string";
  enum?: string[];
  oneOf?: StringOneOf[];
  uiSchema?: UISchema;
}

/**
 * Custom OneOf type for number fields.
 * @typedef {Object} NumberOneOf
 * @property {number} const - The value of the number field.
 * @property {string} title - The title of the number field.
 * @property {string} [description] - The description of the number field.
 *
 */
type NumberOneOf = {
  const: number;
  title?: string;
  description?: string;
};

/**
 * Represents a base number schema. This is used as a base for the NumberSchema type, for instances where the constraints are not needed.
 * @typedef {Object} BaseNumberSchema
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"number" | "integer"} type - The type of the schema.
 *
 */
interface BaseNumberSchema extends Omit<JSONSchema7, "type"> {
  type: "number" | "integer";
}

/**
 * Represents the recommended number schema with additional UI options.
 * @typedef {Object} NumberSchema
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"number" | "integer"} type - The type of the schema.
 * @property {uiSchema} [UISchema] - The UI schema for the number field.
 *
 */
interface NumberSchema extends Omit<JSONSchema7, "type" | "enum" | "oneOf"> {
  type: "number" | "integer";
  enum?: number[];
  oneOf?: NumberOneOf[];
  uiSchema?: UISchema;
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
  title?: string;
};

/**
 * Represents a base boolean schema. This is used as a base for the BooleanSchema type, for instances where the constraints are not needed.
 * @typedef {Object} BaseBooleanSchema
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"boolean"} type - The type of the schema.
 */

interface BaseBooleanSchema extends Omit<JSONSchema7, "type"> {
  type: "boolean";
}

/**
 * Represents the recommended boolean schema with additional UI options.
 * @typedef {Object} BooleanSchema
 * @extends { Omit<JSONSchema7, "type" | "oneOf">}
 * @property {BooleanOneOf[]} oneOf - The oneOf options for the boolean field.
 * @property {uiSchema} [UISchema] - The UI schema for the string field.
 *
 */
interface BooleanSchema extends Omit<JSONSchema7, "type" | "oneOf"> {
  type: "boolean";
  oneOf?: BooleanOneOf[];
  uiSchema?: UISchema;
}

/**
 * Represents a base object schema.
 * @typedef {Object} BaseObjectSchema
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"object"} type - The type of the schema.
 *
 */
interface BaseObjectSchema extends Omit<JSONSchema7, "type"> {
  type: "object";
}

/**
 * Represents a base array schema.
 * @typedef {Object} BaseArraySchema
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"array"} type - The type of the schema.
 */
interface BaseArraySchema extends Omit<JSONSchema7, "type"> {
  type: "array";
}

// Custom Fields Type
type CustomFields = {
  BaseStringField?: React.FC<{ schema: BaseStringSchema; path: string[] }>;
  StringField?: React.FC<{ schema: StringSchema; path: string[] }>;
  BaseNumberSchema?: React.FC<{ schema: BaseNumberSchema; path: string[] }>;
  NumberField?: React.FC<{ schema: NumberSchema; path: string[] }>;
  BaseBooleanField?: React.FC<{ schema: BaseBooleanSchema; path: string[] }>;
  BooleanField?: React.FC<{ schema: BooleanSchema; path: string[] }>;
  ObjectField?: React.FC<{
    schema: BaseObjectSchema;
    path: string[];
    definitions: SchemaDefinitions;
    customFields?: CustomFields;
  }>;
  ArrayField?: React.FC<{
    schema: BaseArraySchema;
    path: string[];
    definitions: SchemaDefinitions;
    customFields?: CustomFields;
  }>;
};

export type {
  BaseStringSchema,
  StringOneOf,
  StringSchema,
  BaseNumberSchema,
  NumberOneOf,
  NumberSchema,
  BaseBooleanSchema,
  BooleanOneOf,
  BooleanSchema,
  BaseObjectSchema,
  BaseArraySchema,
  CustomFields,
  SchemaDefinitions,
  UISchema,
};
