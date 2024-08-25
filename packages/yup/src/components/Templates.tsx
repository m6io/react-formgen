import React from "react";
import * as Yup from "yup";
import {
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  useArrayTemplate,
  FormState,
  useRenderTemplate,
} from "..";
import { generateInitialData } from "../utils";
import { resolveSchema } from "../utils/resolveSchema";
import { FormRootProps, Templates } from "./types";

export const ReadonlyPrimitiveTemplate: React.FC<{
  title?: string;
  value: string | number | boolean | null;
  description?: string;
}> = ({ title, value, description }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {title && <strong>{title}: </strong>}
      <span>{value ?? "N/A"}</span>
      {description && (
        <p style={{ fontSize: "small", color: "#666" }}>{description}</p>
      )}
    </div>
  );
};

export const ReadonlyComplexTemplate: React.FC<{
  title?: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
        paddingLeft: "1rem",
        borderLeft: "2px solid #ccc",
      }}
    >
      {title && <strong>{title}</strong>}
      {description && (
        <p style={{ fontSize: "small", color: "#666" }}>{description}</p>
      )}
      <div style={{ marginTop: "0.5rem" }}>{children}</div>
    </div>
  );
};

export const ErrorsList: React.FC<{ errorsAtPath: Yup.ValidationError[] }> = ({
  errorsAtPath,
}) => {
  return errorsAtPath.map((error, index) => (
    <div key={index} style={{ color: "red" }}>
      {error.message}
    </div>
  ));
};

const WrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const ComplexWrapperStyle: React.CSSProperties = {
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

// String Template
export const StringTemplate: React.FC<{
  schema: Yup.StringSchema<string | undefined> | Yup.DateSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  if (readonly) {
    return (
      <ReadonlyPrimitiveTemplate
        title={schema.describe().meta?.title ?? undefined}
        value={valueAtPath}
        description={schema.describe().meta?.description ?? undefined}
      />
    );
  }

  return (
    <div style={WrapperStyle}>
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      <input
        type="text"
        value={valueAtPath ?? ""}
        onChange={(e) => setValueAtPath(e.target.value)}
        placeholder={schema.describe().meta?.title || ""}
      />
      {schema.describe().meta?.description && (
        <small>{schema.describe().meta?.description}</small>
      )}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

// Number Template
export const NumberTemplate: React.FC<{
  schema: Yup.NumberSchema<number | undefined>;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  if (readonly) {
    return (
      <ReadonlyPrimitiveTemplate
        title={schema.describe().meta?.title ?? undefined}
        value={valueAtPath}
        description={schema.describe().meta?.description ?? undefined}
      />
    );
  }

  return (
    <div style={WrapperStyle}>
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      <input
        type="number"
        value={valueAtPath ?? ""}
        onChange={(e) =>
          setValueAtPath(e.target.value ? Number(e.target.value) : null)
        }
        placeholder={schema.describe().meta?.title || ""}
      />
      {schema.describe().meta?.description && (
        <small>{schema.describe().meta?.description}</small>
      )}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

// Boolean Template
export const BooleanTemplate: React.FC<{
  schema: Yup.BooleanSchema<boolean | undefined>;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  if (readonly) {
    return (
      <ReadonlyPrimitiveTemplate
        title={schema.describe().meta?.title ?? undefined}
        value={valueAtPath ? "true" : "false"}
        description={schema.describe().meta?.description ?? undefined}
      />
    );
  }

  return (
    <div
      style={{
        ...WrapperStyle,
        alignItems: "flex-start",
      }}
    >
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      <input
        type="checkbox"
        checked={valueAtPath}
        onChange={(e) => setValueAtPath(e.target.checked)}
      />
      {schema.describe().meta?.description && (
        <small>{schema.describe().meta?.description}</small>
      )}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

// Object Template
export const ObjectTemplate: React.FC<{
  schema: Yup.ObjectSchema<any>;
  path: string[];
}> = ({ schema, path }) => {
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);
  const RenderTemplate = useRenderTemplate();

  if (readonly) {
    return (
      <ReadonlyComplexTemplate
        title={schema.describe().meta?.title}
        description={schema.describe().meta?.description}
      >
        {schema.fields && Object.keys(schema.fields).length > 0 ? (
          Object.keys(schema.fields).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.fields[key] as Yup.AnySchema}
              path={[...path, key]}
            />
          ))
        ) : (
          <div style={{ color: "#888" }}>No data available</div>
        )}
      </ReadonlyComplexTemplate>
    );
  }

  return (
    <div style={WrapperStyle}>
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      {schema.describe().meta?.description && (
        <small>{schema.describe().meta?.description}</small>
      )}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
      <div
        style={{
          border: "0.125rem solid",
          ...ComplexWrapperStyle,
        }}
      >
        {schema.fields &&
          Object.keys(schema.fields).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.fields[key] as Yup.AnySchema}
              path={[...path, key]}
            />
          ))}
      </div>
    </div>
  );
};

// Ensure the inner schema is correctly typed
const getInnerSchema = (
  schema: Yup.ArraySchema<any, any, any>
): Yup.AnySchema => {
  return schema.innerType instanceof Yup.Schema
    ? schema.innerType
    : Yup.mixed();
};

// Array Template
export const ArrayTemplate: React.FC<{
  schema: Yup.ArraySchema<any, any, any>;
  path: string[];
}> = ({ schema, path }) => {
  const innerSchema = getInnerSchema(schema);
  const readonly = useFormContext((state: FormState) => state.readonly);
  const RenderTemplate = useRenderTemplate();
  const { valueAtPath, errorsAtPath, moveItem, removeItem, addItem } =
    useArrayTemplate(path, () => generateInitialData(innerSchema));

  if (readonly) {
    return (
      <ReadonlyComplexTemplate
        title={schema.describe().meta?.title}
        description={schema.describe().meta?.description}
      >
        {Array.isArray(valueAtPath) && valueAtPath.length > 0 ? (
          valueAtPath.map((_, index: number) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <RenderTemplate
                schema={innerSchema}
                path={[...path, index.toString()]}
              />
            </div>
          ))
        ) : (
          <div style={{ color: "#888" }}>No items available</div>
        )}
      </ReadonlyComplexTemplate>
    );
  }

  return (
    <div style={WrapperStyle}>
      {schema.describe().meta?.title && (
        <label>{schema.describe().meta?.title}</label>
      )}
      {schema.describe().meta?.description && (
        <small>{schema.describe().meta?.description}</small>
      )}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
      <div
        style={{
          border: "0.25rem dashed",
          ...ComplexWrapperStyle,
        }}
      >
        {Array.isArray(valueAtPath) &&
          valueAtPath.map((_, index: number) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
              key={index}
            >
              <RenderTemplate
                schema={innerSchema}
                path={[...path, index.toString()]}
              />
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "0.125rem dashed",
                }}
              >
                <button
                  type="button"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                >
                  Move Up
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === valueAtPath.length - 1}
                >
                  Move Down
                </button>
                <button type="button" onClick={() => removeItem(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        <button type="button" onClick={addItem}>
          Add Item
        </button>
      </div>
    </div>
  );
};

export const BaseTemplates: Templates = {
  StringTemplate: StringTemplate,
  NumberTemplate: NumberTemplate,
  BooleanTemplate: BooleanTemplate,
  ObjectTemplate: ObjectTemplate,
  ArrayTemplate: ArrayTemplate,
};

// Helper function to check if schema is an ObjectSchema
const isObjectSchema = (
  schema: Yup.AnySchema
): schema is Yup.ObjectSchema<any> => {
  return resolveSchema(schema).type === "object";
};

/**
 * Form component that renders the form based on the schema.
 * @param {FormRootProps} props - The props for the BaseFormRoot.
 * @returns {JSX.Element} The form component.
 */
export const BaseFormRoot: React.FC<FormRootProps> = ({
  onSubmit,
  onError,
}) => {
  const readonly = useFormContext((state: FormState) => state.readonly);
  const schema = useFormContext((state: FormState) => state.schema);
  const formData = useFormContext((state: FormState) => state.formData);
  const setErrors = useFormContext((state: FormState) => state.setErrors);
  const RenderTemplate = useRenderTemplate();

  const resolvedSchema = resolveSchema(schema);

  if (readonly) {
    return (
      <div style={ComplexWrapperStyle}>
        {isObjectSchema(resolvedSchema) &&
          Object.keys(resolvedSchema.fields).map((key) => (
            <RenderTemplate
              key={key}
              schema={resolvedSchema.fields[key] as Yup.AnySchema}
              path={[key]}
            />
          ))}
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      resolvedSchema.validateSync(formData, { abortEarly: false });
      setErrors(null);
      onSubmit(formData);
    } catch (validationErrors) {
      const yupErrors = validationErrors as Yup.ValidationError;
      setErrors(yupErrors.inner);
      onError(yupErrors.inner, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={ComplexWrapperStyle}>
      {isObjectSchema(resolvedSchema) &&
        Object.keys(resolvedSchema.fields).map((key) => (
          <RenderTemplate
            key={key}
            schema={resolvedSchema.fields[key] as Yup.AnySchema}
            path={[key]}
          />
        ))}
      <button type="submit">Submit</button>
    </form>
  );
};
