import type * as z from "zod/v4/core";

/**
 * Represents the props for the Form component.
 *
 * @property {z.$ZodType} schema - The Zod schema used for form validation and data structure
 * @property {{ [key: string]: unknown }} [initialData] - Initial form data
 * @property {(data: unknown) => void} [onSubmit] - Callback function for form submission
 * @property {(issues: z.$ZodIssue[], data?: { [key: string]: unknown }) => void} [onError] - Callback function for form errors
 * @property {Templates} templates - Custom templates used in rendering type-specific components
 * @property {React.FC<FormRootProps>} formRoot - Custom form root component
 * @property {React.FC<RenderTemplateProps>} [renderTemplate] - Custom template renderer override
 * @property {boolean} [readonly] - Whether to render the form in readonly mode
 * @property {boolean} [enableDevtools] - Whether to enable Zustand devtools for debugging
 */
export type FormProps = {
  schema: z.$ZodType;
  initialData?: { [key: string]: unknown };
  onSubmit?: (data: unknown) => void;
  onError?: (issues: z.$ZodIssue[], data?: { [key: string]: unknown }) => void;
  templates: Templates; // Required
  formRoot: React.FC<FormRootProps>; // Required
  renderTemplate?: React.FC<RenderTemplateProps>;
  readonly?: boolean;
  enableDevtools?: boolean;
};

/**
 * Represents the props for the FormProvider component.
 *
 * @property {z.$ZodType} schema - The Zod schema used for form validation and data structure
 * @property {{ [key: string]: unknown }} [initialData] - Initial form data
 * @property {React.ReactNode} children - Child components that will have access to the form context
 * @property {Templates} templates - Custom templates used in rendering type-specific components
 * @property {boolean} [readonly] - Whether to render the form in readonly mode
 * @property {React.FC<RenderTemplateProps>} [renderTemplate] - Optional custom render template function
 * @property {boolean} [enableDevtools] - Whether to enable Zustand devtools for debugging
 */
export type FormProviderProps = {
  schema: z.$ZodType;
  initialData?: { [key: string]: unknown };
  children: React.ReactNode;
  templates: Templates;
  readonly?: boolean;
  renderTemplate?: React.FC<RenderTemplateProps>;
  enableDevtools?: boolean;
};

/**
 * Represents the props for the FormRoot component.
 * This is the component responsible for rendering the form container, handling form submission,
 * and displaying validation errors.
 *
 * @property {(data: unknown) => void} onSubmit - Called on successful form submission
 * @property   {(issues: z.$ZodIssue[], data?: { [key: string]: unknown }) => void} onError - Called when there are validation errors
 */
export type FormRootProps = {
  onSubmit: (data: unknown) => void;
  onError: (issues: z.$ZodIssue[], data?: { [key: string]: unknown }) => void;
};

/**
 * Represents the custom templates for each schema type.
 * You MUST provide implementations for all of these template components.
 */
export type Templates = {
  StringTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  NumberTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  BooleanTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  BigIntTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  DateTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  ArrayTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  ObjectTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  UnionTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  TupleTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  EnumTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
  LiteralTemplate: React.FC<{ schema: z.$ZodType; path: string[] }>;
};

/**
 * Props for the RenderTemplate component.
 * This component is responsible for rendering the correct template based on the schema type.
 *
 * @property {z.$ZodType} schema - The Zod schema to be rendered
 * @property {string[]} path - The path to the property corresponding to the schema
 */
export interface RenderTemplateProps {
  schema: z.$ZodType;
  path: string[];
}

/**
 * Represents the UI schema for a property.
 * This can be used to provide UI-specific configuration for a schema property.
 *
 * @property {string} component - The component to use for the property
 * @property {Record<string, unknown>} [props] - The props to pass to the component
 */
export interface UISchema {
  component: string;
  props?: Record<string, unknown>;
}

/**
 * Metadata type returned by the meta() method
 */
export interface SchemaMetadata {
  title?: string;
  description?: string;
  uiSchema?: UISchema;
  [key: string]: unknown;
}

/**
 * Extended Zod type that includes the meta method
 * This represents schemas that have been extended with metadata capabilities
 */
export interface $ZodTypeWithMeta<T = unknown, U = T> extends z.$ZodType<T, U> {
  meta(): SchemaMetadata;
}
