import React from "react";
import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { JSONSchema7 } from "json-schema";
import {
  BaseStringSchema,
  BaseArraySchema,
  BaseNumberSchema,
  BaseBooleanSchema,
  BaseObjectSchema,
  Templates,
  FormRootProps,
} from "./types";
import {
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  useArrayTemplate,
  FormState,
} from "..";
import { RenderTemplate } from "./RenderTemplate";
import { generateInitialData } from "../utils";

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

export const ErrorsList: React.FC<{ errorsAtPath: ErrorObject[] }> = ({
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
  schema: BaseStringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  if (readonly) {
    return (
      <ReadonlyPrimitiveTemplate
        title={schema.title ?? undefined}
        value={valueAtPath}
        description={schema.description ?? undefined}
      />
    );
  }

  return (
    <div style={WrapperStyle}>
      {schema.title && <label>{schema.title}</label>}
      <input
        type="text"
        value={valueAtPath ?? ""}
        onChange={(e) => setValueAtPath(e.target.value)}
        placeholder={schema.title || ""}
      />
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

// Number Template
export const NumberTemplate: React.FC<{
  schema: BaseNumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  if (readonly) {
    return (
      <ReadonlyPrimitiveTemplate
        title={schema.title ?? undefined}
        value={valueAtPath}
        description={schema.description ?? undefined}
      />
    );
  }

  return (
    <div style={WrapperStyle}>
      {schema.title && <label>{schema.title}</label>}
      <input
        type="number"
        value={valueAtPath ?? ""}
        onChange={(e) =>
          setValueAtPath(e.target.value ? Number(e.target.value) : null)
        }
        placeholder={schema.title || ""}
      />
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

// Boolean Template
export const BooleanTemplate: React.FC<{
  schema: BaseBooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  if (readonly) {
    return (
      <ReadonlyPrimitiveTemplate
        title={schema.title ?? undefined}
        value={valueAtPath ? "true" : "false"}
        description={schema.description ?? undefined}
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
      {schema.title && <label>{schema.title}</label>}
      <input
        type="checkbox"
        checked={valueAtPath}
        onChange={(e) => setValueAtPath(e.target.checked)}
      />
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

// Object Template
export const ObjectTemplate: React.FC<{
  schema: BaseObjectSchema;
  path: string[];
}> = ({ schema, path }) => {
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  if (readonly) {
    return (
      <ReadonlyComplexTemplate
        title={schema.title}
        description={schema.description}
      >
        {schema.properties && Object.keys(schema.properties).length > 0 ? (
          Object.keys(schema.properties).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.properties?.[key] as JSONSchema7}
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
      {schema.title && <label>{schema.title}</label>}
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
      <div
        style={{
          border: "0.125rem solid",
          ...ComplexWrapperStyle,
        }}
      >
        {schema.properties &&
          Object.keys(schema.properties).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.properties?.[key] as JSONSchema7}
              path={[...path, key]}
            />
          ))}
      </div>
    </div>
  );
};

// Array Template
export const ArrayTemplate: React.FC<{
  schema: BaseArraySchema;
  path: string[];
}> = ({ schema, path }) => {
  const readonly = useFormContext((state: FormState) => state.readonly);
  const definitions = useFormContext(
    (state: FormState) => state.schema.definitions || {}
  );

  const { valueAtPath, errorsAtPath, moveItem, removeItem, addItem } =
    useArrayTemplate(path, () =>
      generateInitialData(schema.items as JSONSchema7, definitions)
    );
  if (readonly) {
    return (
      <ReadonlyComplexTemplate
        title={schema.title}
        description={schema.description}
      >
        {Array.isArray(valueAtPath) && valueAtPath.length > 0 ? (
          valueAtPath.map((_, index: number) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <RenderTemplate
                schema={schema.items as JSONSchema7}
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
      {schema.title && <label>{schema.title}</label>}
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
      <div
        style={{
          border: "0.25rem dashed",
          ...ComplexWrapperStyle,
        }}
      >
        {schema.items &&
          Array.isArray(valueAtPath) &&
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
                schema={schema.items as JSONSchema7}
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

// Single shared Ajv instance with formats
export const AjvInstance = new Ajv({
  allErrors: true,
  verbose: true,
}).addKeyword("uiSchema");
addFormats(AjvInstance);

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

  if (readonly) {
    return (
      <div style={ComplexWrapperStyle}>
        {Object.keys(schema.properties || {}).map((key) => (
          <RenderTemplate
            key={key}
            schema={schema.properties?.[key] as JSONSchema7}
            path={[key]}
          />
        ))}
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validate = AjvInstance.compile(schema);
    const valid = validate(formData);
    if (valid) {
      setErrors(null);
      onSubmit(formData);
    } else {
      setErrors(validate.errors ?? null);
      onError(validate.errors ?? [], formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={ComplexWrapperStyle}>
      {Object.keys(schema.properties || {}).map((key) => (
        <RenderTemplate
          key={key}
          schema={schema.properties?.[key] as JSONSchema7}
          path={[key]}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
