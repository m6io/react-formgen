import { ErrorObject } from "ajv";
import { JSONSchema7 } from "json-schema";

/**
 * Represents the props for the Form.
 * @typedef {Object} FormProps
 * @property {JSONSchema7 | FormgenJSONSchema7} schema - The schema for the form.
 * @property {{ [key: string]: unknown }} [initialData] - The initial data for the form.
 * @property {(data: { [key: string]: unknown }) => void} onSubmit - The function to call when the form is submitted.
 * @property {(errors: ErrorObject[], data?: { [key: string]: unknown }) => void} onError - The function to call when there are errors in the form.
 * @property {Templates} [templates] - The typed templates to use for the form.
 * @property {React.FC<FormRootProps>} [formRoot] - The custom form component to use for the form.
 * @property {React.FC} [displayTemplate] - The custom display component to use for the form.
 * @property {boolean} [readonly] - Whether the form is read-only.
 *
 */
export type FormProps = {
  schema: JSONSchema7 | FormgenJSONSchema7;
  initialData?: { [key: string]: unknown };
  onSubmit?: (data: { [key: string]: unknown }) => void;
  onError?: (errors: ErrorObject[], data?: { [key: string]: unknown }) => void;
  templates?: Templates;
  formRoot?: React.FC<FormRootProps>;
  displayTemplate?: React.FC;
  readonly?: boolean;
};

/**
 * Represents the props for the FormRoot.
 * @typedef {Object} FormRootProps
 * @property {(data: { [key: string]: unknown }) => void} onSubmit - The function to call when the form is submitted.
 * @property {(errors: ErrorObject[], data?: { [key: string]: unknown }) => void} onError - The function to call when there are errors in the form.
 *
 */
export type FormRootProps = {
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: ErrorObject[], data?: { [key: string]: unknown }) => void;
};

/**
 * Represents the UI schema for a property.
 * @typedef {Object} UISchema
 * @property {string} component - The component to use for the property.
 * @property {Record<string, unknown>} [props] - The props to pass to the component.
 */
export interface UISchema {
  component: string;
  props?: Record<string, unknown>;
}

// Create a recursive type that extends JSONSchema7 with `uiSchema`
export interface FormgenJSONSchema7
  extends Omit<JSONSchema7, "properties" | "definitions"> {
  uiSchema?: UISchema;
  properties?: Record<string, FormgenJSONSchema7>;
  definitions?: Record<string, FormgenJSONSchema7>;
}

/**
 * Custom OneOf type for strings.
 * @typedef {Object} StringOneOf
 * @property {string} const - The value of the string property.
 * @property {string} title - The title of the string property.
 * @property {string} [description] - The description of the string property.
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
 * @extends {Omit<FormgenJSONSchema7, "type" | "enum" | "oneOf">}
 * @property {"string"} type - The type of the schema.
 * @property {string[]} [enum] - The enum options for the string property. This is evaluated first before the oneOf options.
 * @property {StringOneOf[]} [oneOf] - The oneOf options for the string property.
 * @property {uiSchema} [UISchema] - The UI schema for the string property.
 *
 */
export interface StringSchema
  extends Omit<FormgenJSONSchema7, "type" | "enum" | "oneOf"> {
  type: "string";
  enum?: string[];
  oneOf?: StringOneOf[];
  uiSchema?: UISchema;
}

/**
 * Custom OneOf type for numbers.
 * @typedef {Object} NumberOneOf
 * @property {number} const - The value of the number property.
 * @property {string} title - The title of the number property.
 * @property {string} [description] - The description of the number property.
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
 * @extends {Omit<FormgenJSONSchema7, "type">}
 * @property {"number" | "integer"} type - The type of the schema.
 * @property {number[]} [enum] - The enum options for the number property. This is evaluated first before the oneOf options.
 * @property {NumberOneOf[]} [oneOf] - The oneOf options for the number property.
 * @property {uiSchema} [UISchema] - The UI schema for the number property.
 *
 */
export interface NumberSchema
  extends Omit<FormgenJSONSchema7, "type" | "enum" | "oneOf"> {
  type: "number" | "integer";
  enum?: number[];
  oneOf?: NumberOneOf[];
  uiSchema?: UISchema;
}

/**
 * Custom OneOf type for booleans.
 * @typedef {Object} BooleanOneOf
 * @property {boolean} const - The value of the boolean property.
 * @property {string} title - The title of the boolean property.
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
 * @extends { Omit<FormgenJSONSchema7, "type" | "oneOf">}
 * @property {BooleanOneOf[]} oneOf - The oneOf options for the boolean property.
 * @property {uiSchema} [UISchema] - The UI schema for the string property.
 *
 */
export interface BooleanSchema
  extends Omit<FormgenJSONSchema7, "type" | "oneOf"> {
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
 * Represents the recommended object schema with additional UI options.
 * @typedef {Object} ObjectSchema
 * @extends {Omit<FormgenJSONSchema7, "type">}
 * @property {"object"} type - The type of the schema.
 * @property {uiSchema} [UISchema] - The UI schema for the object property.
 *
 */
export interface ObjectSchema extends Omit<FormgenJSONSchema7, "type"> {
  type: "object";
  uiSchema?: UISchema;
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

/**
 * Represents the recommended array schema with additional UI options.
 * @typedef {Object} ArraySchema
 * @extends {Omit<FormgenJSONSchema7, "type">}
 * @property {"array"} type - The type of the schema.
 * @property {uiSchema} [UISchema] - The UI schema for the array property.
 */
export interface ArraySchema extends Omit<FormgenJSONSchema7, "type"> {
  type: "array";
  uiSchema?: UISchema;
}

/**
 * Represents the custom templates for the form.
 * @typedef {Object} Templates
 * @property {React.FC<{ schema: StringSchema; path: string[] }>} StringTemplate - The custom template for strings.
 * @property {React.FC<{ schema: NumberSchema; path: string[] }>} NumberTemplate - The custom template for numbers.
 * @property {React.FC<{ schema: BooleanSchema; path: string[] }>} BooleanTemplate - The custom template for booleans.
 * @property {React.FC<{ schema: BaseObjectSchema; path: string[] }>} ObjectTemplate - The custom template for objects.
 * @property {React.FC<{ schema: BaseArraySchema; path: string[] }>} ArrayTemplate - The custom template for arrays.
 * @returns {Templates} The custom templates for the form.
 */
export type Templates = {
  StringTemplate:
    | React.FC<{ schema: StringSchema; path: string[] }>
    | React.FC<{ schema: BaseStringSchema; path: string[] }>;
  NumberTemplate:
    | React.FC<{ schema: NumberSchema; path: string[] }>
    | React.FC<{ schema: BaseNumberSchema; path: string[] }>;
  BooleanTemplate:
    | React.FC<{ schema: BooleanSchema; path: string[] }>
    | React.FC<{ schema: BaseBooleanSchema; path: string[] }>;
  ObjectTemplate: React.FC<{
    schema: BaseObjectSchema;
    path: string[];
  }>;
  ArrayTemplate: React.FC<{
    schema: BaseArraySchema;
    path: string[];
  }>;
};

/**
 * Props for the RenderTemplate component.
 * @interface RenderTemplateProps
 * @property {JSONSchema7 | FormgenJSONSchema7} schema - The schema to render.
 * @property {string[]} path - The path to the schema.
 * @returns {JSX.Element} The template component.
 */
export interface RenderTemplateProps {
  schema: JSONSchema7 | FormgenJSONSchema7;
  path: string[];
}
