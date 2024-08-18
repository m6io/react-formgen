import * as Yup from "yup";

export type FormProps = {
  schema: Yup.AnyObjectSchema;
  initialData?: { [key: string]: unknown };
  onSubmit?: (data: { [key: string]: unknown }) => void;
  onError?: (
    errors: Yup.ValidationError[],
    data?: { [key: string]: unknown }
  ) => void;
  templates?: Templates;
  formRoot?: React.FC<FormRootProps>;
  readonly?: boolean;
};

export type FormRootProps = {
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (
    errors: Yup.ValidationError[],
    data?: { [key: string]: unknown }
  ) => void;
};

export type Templates = {
  StringTemplate: React.FC<{
    schema: Yup.StringSchema<string | undefined, object> | Yup.DateSchema;
    path: string[];
  }>;
  NumberTemplate: React.FC<{
    schema: Yup.NumberSchema<number | undefined, object>;
    path: string[];
  }>;
  BooleanTemplate: React.FC<{
    schema: Yup.BooleanSchema<boolean | undefined, object>;
    path: string[];
  }>;
  ObjectTemplate: React.FC<{
    schema: Yup.ObjectSchema<any, object>;
    path: string[];
  }>;
  ArrayTemplate: React.FC<{
    schema: Yup.ArraySchema<any, object>;
    path: string[];
  }>;
};

export interface RenderTemplateProps {
  schema: Yup.AnySchema;
  path: string[];
}
