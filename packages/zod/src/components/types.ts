import { z } from "zod";

export type FormProps = {
  schema: z.ZodType<any>;
  initialData?: { [key: string]: unknown };
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: z.ZodIssue[]) => void;
  fieldTemplates?: FieldTemplates;
  formTemplate?: React.FC<FormTemplateProps>;
};

export type FormTemplateProps = {
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: z.ZodIssue[], data?: { [key: string]: unknown }) => void;
  fieldTemplates: FieldTemplates;
};

export type FieldTemplates = {
  StringField: React.FC<{ schema: z.ZodString; path: string[] }>;
  NumberField: React.FC<{ schema: z.ZodNumber; path: string[] }>;
  BooleanField: React.FC<{ schema: z.ZodBoolean; path: string[] }>;
  ObjectFieldset: React.FC<{
    schema: z.ZodObject<any>;
    path: string[];
    fieldTemplates: FieldTemplates;
  }>;
  ArrayFieldset: React.FC<{
    schema: z.ZodArray<any>;
    path: string[];
    fieldTemplates: FieldTemplates;
  }>;
  StringDisplay: React.FC<{ schema: z.ZodString; path: string[] }>;
  NumberDisplay: React.FC<{ schema: z.ZodNumber; path: string[] }>;
  BooleanDisplay: React.FC<{ schema: z.ZodBoolean; path: string[] }>;
  ObjectDisplay: React.FC<{
    schema: z.ZodObject<any>;
    path: string[];
    fieldTemplates: FieldTemplates;
  }>;
  ArrayDisplay: React.FC<{
    schema: z.ZodArray<any>;
    path: string[];
    fieldTemplates: FieldTemplates;
  }>;
};

export type DataDisplayProps = {
  schema: z.ZodType<any>;
  initialData?: { [key: string]: unknown };
  fieldTemplates?: FieldTemplates;
  displayTemplate?: React.FC<DisplayTemplateProps>;
};

export type DisplayTemplateProps = {
  fieldTemplates: FieldTemplates;
};

export interface RenderTemplateProps {
  schema: z.ZodType<any>;
  path: string[];
  fieldTemplates: FieldTemplates;
  readOnly?: boolean;
}
