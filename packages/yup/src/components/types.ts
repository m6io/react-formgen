import * as Yup from "yup";

export type FormProps = {
  schema: Yup.AnyObjectSchema;
  initialData?: { [key: string]: unknown };
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: Yup.ValidationError[]) => void;
  fieldTemplates?: FieldTemplates;
  formTemplate?: React.FC<FormTemplateProps>;
};

export type FormTemplateProps = {
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (
    errors: Yup.ValidationError[],
    data?: { [key: string]: unknown }
  ) => void;
  fieldTemplates: FieldTemplates;
};

export type FieldTemplates = {
  StringField: React.FC<{
    schema: Yup.StringSchema<string | undefined, object> | Yup.DateSchema;
    path: string[];
  }>;
  NumberField: React.FC<{
    schema: Yup.NumberSchema<number | undefined, object>;
    path: string[];
  }>;
  BooleanField: React.FC<{
    schema: Yup.BooleanSchema<boolean | undefined, object>;
    path: string[];
  }>;
  ObjectFieldset: React.FC<{
    schema: Yup.ObjectSchema<any, object>;
    path: string[];
    fieldTemplates: FieldTemplates;
  }>;
  ArrayFieldset: React.FC<{
    schema: Yup.ArraySchema<any, object>;
    path: string[];
    fieldTemplates: FieldTemplates;
  }>;
  StringDisplay: React.FC<{
    schema: Yup.StringSchema<string | undefined, object> | Yup.DateSchema;
    path: string[];
  }>;
  NumberDisplay: React.FC<{
    schema: Yup.NumberSchema<number | undefined, object>;
    path: string[];
  }>;
  BooleanDisplay: React.FC<{
    schema: Yup.BooleanSchema<boolean | undefined, object>;
    path: string[];
  }>;
  ObjectDisplay: React.FC<{
    schema: Yup.ObjectSchema<any, object>;
    path: string[];
    fieldTemplates: FieldTemplates;
  }>;
  ArrayDisplay: React.FC<{
    schema: Yup.ArraySchema<any, object>;
    path: string[];
    fieldTemplates: FieldTemplates;
  }>;
};

export type DataDisplayProps = {
  schema: Yup.AnyObjectSchema;
  initialData?: { [key: string]: unknown };
  fieldTemplates?: FieldTemplates;
  displayTemplate?: React.FC<DisplayTemplateProps>;
};

export type DisplayTemplateProps = {
  fieldTemplates: FieldTemplates;
};

export interface RenderTemplateProps {
  schema: Yup.AnySchema;
  path: string[];
  fieldTemplates: FieldTemplates;
  readOnly?: boolean;
}
