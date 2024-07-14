import { ErrorObject } from "ajv";
import { JSONSchema7 } from "json-schema";

/**
 * Represents the props for the Form.
 * @typedef {Object} FormProps
 * @property {JSONSchema7} schema - The schema for the form.
 * @property {{ [key: string]: unknown }} [initialData] - The initial data for the form.
 * @property {(data: { [key: string]: unknown }) => void} onSubmit - The function to call when the form is submitted.
 * @property {(errors: ErrorObject[]) => void} onError - The function to call when there are errors in the form.
 * @property {FieldTemplates} [fieldTemplates] - The custom fields to use for the form.
 * @property {React.FC<FormTemplateProps>} [formTemplate] - The custom form component to use for the form.
 *
 */
export type FormProps = {
  schema: JSONSchema7;
  initialData?: { [key: string]: unknown };
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: ErrorObject[]) => void;
  fieldTemplates?: FieldTemplates;
  formTemplate?: React.FC<FormTemplateProps>;
};

/**
 * Represents the props for the FormTemplate.
 * @typedef {Object} FormTemplateProps
 * @property {(data: { [key: string]: unknown }) => void} onSubmit - The function to call when the form is submitted.
 * @property {(errors: ErrorObject[], data?: { [key: string]: unknown }) => void} onError - The function to call when there are errors in the form.
 * @property {FieldTemplates} [fieldTemplates] - The custom fields to use for the form.
 *
 */
export type FormTemplateProps = {
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: ErrorObject[], data?: { [key: string]: unknown }) => void;
  fieldTemplates: FieldTemplates;
};

export type SchemaDefinitions = JSONSchema7["definitions"];

/**
 * Represents the UI schema for a field.
 * @typedef {Object} UISchema
 * @property {string} component - The component to use for the field.
 * @property {Object.<string, unknown>} [props] - The props to pass to the component.
 */
export type UISchema = {
  component: string;
  props?: {
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
export type StringOneOf = {
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
export interface BaseStringSchema extends Omit<JSONSchema7, "type"> {
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
export interface StringSchema
  extends Omit<JSONSchema7, "type" | "enum" | "oneOf"> {
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
export type NumberOneOf = {
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
export interface BaseNumberSchema extends Omit<JSONSchema7, "type"> {
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
export interface NumberSchema
  extends Omit<JSONSchema7, "type" | "enum" | "oneOf"> {
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
export type BooleanOneOf = {
  const: boolean;
  title?: string;
};

/**
 * Represents a base boolean schema. This is used as a base for the BooleanSchema type, for instances where the constraints are not needed.
 * @typedef {Object} BaseBooleanSchema
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"boolean"} type - The type of the schema.
 */

export interface BaseBooleanSchema extends Omit<JSONSchema7, "type"> {
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
export interface BooleanSchema extends Omit<JSONSchema7, "type" | "oneOf"> {
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
export interface BaseObjectSchema extends Omit<JSONSchema7, "type"> {
  type: "object";
}

/**
 * Represents a base array schema.
 * @typedef {Object} BaseArraySchema
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"array"} type - The type of the schema.
 */
export interface BaseArraySchema extends Omit<JSONSchema7, "type"> {
  type: "array";
}

// Custom Fields Type
export type FieldTemplates = {
  StringField:
    | React.FC<{ schema: StringSchema; path: string[] }>
    | React.FC<{ schema: BaseStringSchema; path: string[] }>;
  NumberField:
    | React.FC<{ schema: NumberSchema; path: string[] }>
    | React.FC<{ schema: BaseNumberSchema; path: string[] }>;
  BooleanField:
    | React.FC<{ schema: BooleanSchema; path: string[] }>
    | React.FC<{ schema: BaseBooleanSchema; path: string[] }>;
  ObjectFieldset: React.FC<{
    schema: BaseObjectSchema;
    path: string[];
    definitions: SchemaDefinitions;
    fieldTemplates: FieldTemplates;
  }>;
  ArrayFieldset: React.FC<{
    schema: BaseArraySchema;
    path: string[];
    definitions: SchemaDefinitions;
    fieldTemplates: FieldTemplates;
  }>;
};
