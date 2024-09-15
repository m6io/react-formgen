import React from "react";
import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import {
  StringSchema,
  ArraySchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  Templates,
  FormRootProps,
  FormgenJSONSchema7,
} from "./types";
import {
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  useArrayTemplate,
  FormState,
  useRenderTemplate,
} from "..";
import { generateInitialData, resolveSchema } from "../utils";

export function useWindowSize(): {
  width: number | null;
  height: number | null;
} {
  const [size, setSize] = React.useState<{
    width: number | null;
    height: number | null;
  }>({
    width: null,
    height: null,
  });

  React.useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}

export const ReadonlyPrimitiveTemplate: React.FC<{
  title?: string;
  value?: string | number | boolean;
  description?: string;
}> = ({ title, value, description }) => {
  return (
    <div
      style={{
        width: "100%",
        ...WrapperStyle,
      }}
    >
      {title && <label style={{ fontWeight: "600" }}>{title}</label>}
      <div style={{ padding: "8px" }}>{value ?? "N/A"}</div>
      {description && <small>{description}</small>}
    </div>
  );
};

/**
 * ReadonlyComplexTemplate
 * Renders a readonly view of complex data (objects or arrays) with a title and description.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The title of the field.
 * @param {string} [props.description] - The description of the field.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} - The readonly complex component.
 */
export const ReadonlyComplexTemplate: React.FC<{
  title?: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div
      style={{
        width: "100%",
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

/**
 * ErrorsList
 * Displays a list of validation errors for a given path.
 * @param {Object} props - The props for the component.
 * @param {ErrorObject[]} props.errorsAtPath - The list of error objects at the path.
 * @returns {JSX.Element} - The errors list component.
 */
export const ErrorsList: React.FC<{ errorsAtPath: ErrorObject[] }> = ({
  errorsAtPath,
}) => {
  return errorsAtPath.map((error, index) => (
    <div key={index} style={{ color: "red", width: "100%" }}>
      {error.message}
    </div>
  ));
};

const WrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const ComplexWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
};

/**
 * StringTemplate
 * Handles switching between input, select, and date fields based on schema metadata.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the string property.
 * @param {string[]} props.path - The path to the string property in the form data.
 * @returns {JSX.Element} - The string template component.
 */
export const StringTemplate: React.FC<{
  schema: StringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const stringMatchers = [
    {
      matcher: (schema: StringSchema) => schema.enum || schema.oneOf,
      render: () => <SelectTemplate schema={schema} path={path} />,
      // Alternative render method
      // render: () => (
      //   <MultipleChoiceTemplate schema={schema} path={path} />
      // ),
    },
    {
      matcher: (schema: StringSchema) =>
        schema.format &&
        ["date", "datetime", "date-time"].includes(schema.format),
      render: () => (
        <InputTemplate
          schema={schema}
          path={path}
          htmlType={
            schema.format === "datetime" ? "datetime-local" : schema.format
          }
        />
      ),
    },
    {
      matcher: (schema: StringSchema) => schema.format === "email",
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="email" />
      ),
    },
    {
      matcher: (schema: StringSchema) => schema.format === "uri",
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="url" />
      ),
    },
    {
      matcher: () => true,
      render: () => <InputTemplate schema={schema} path={path} />,
    },
  ];

  for (const { matcher, render } of stringMatchers) {
    if (matcher(schema)) {
      return render();
    }
  }
  return <InputTemplate schema={schema} path={path} />;
};

/**
 * InputTemplate
 * Renders a text input field for string and number schemas.
 * @param {Object} props - The props for the component.
 * @param {StringSchema | NumberSchema} props.schema - The schema for the input field.
 * @param {string[]} props.path - The path to the input field in the form data.
 * @param {string} [props.htmlType] - The HTML input type (default: "text").
 * @returns {JSX.Element} - The input field component.
 */
export const InputTemplate: React.FC<{
  schema: StringSchema | NumberSchema;
  path: string[];
  htmlType?: string;
}> = ({ schema, path, htmlType = "text" }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);
  const size = useWindowSize();

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
    <div
      style={{
        width: size.width && size.width > 640 ? "min-content" : "100%",
        ...WrapperStyle,
      }}
    >
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      <input
        type={htmlType}
        value={valueAtPath ?? ""}
        disabled={schema.readOnly}
        onChange={(e) => setValueAtPath(e.target.value ? e.target.value : null)}
        placeholder={schema.title || ""}
        style={{
          width: size.width && size.width > 640 ? "12rem" : "100%",
          padding: "8px",
          border: "1px solid #d1d5db",
          borderRadius: "0.375rem",
          boxSizing: "border-box",
        }}
      />
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

// Memoized MultipleChoiceOptionTemplate to prevent re-renders unless its props change
const MultipleChoiceOptionTemplate: React.FC<{
  value: string;
  title: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}> = React.memo(({ value, title, checked, onChange, disabled }) => {
  return (
    <label style={{ display: "flex", alignItems: "center" }}>
      <input
        type="radio"
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        style={{
          height: "16px",
          width: "16px",
          marginRight: "8px",
        }}
      />
      <span>{title}</span>
    </label>
  );
});

/**
 * MultipleChoiceTemplate
 * Renders a multiple-choice field as radio buttons for string schemas with enum or oneOf options.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the multiple-choice field.
 * @param {string[]} props.path - The path to the field in the form data.
 * @returns {JSX.Element} - The multiple-choice field component.
 */
export const MultipleChoiceTemplate: React.FC<{
  schema: StringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueAtPath(event.target.value);
    },
    [setValueAtPath]
  );

  // Memoize the options to prevent unnecessary recalculations
  const opts: { value: string; title: string }[] = React.useMemo(() => {
    const options: { value: string; title: string }[] = [];
    if (schema.enum) {
      schema.enum.forEach((opt) => options.push({ value: opt, title: opt }));
    } else if (schema.oneOf) {
      schema.oneOf.forEach((opt) =>
        options.push({ value: opt.const, title: opt.title ?? opt.const })
      );
    }
    return options;
  }, [schema.enum, schema.oneOf]);

  // Memoize the option rendering to avoid recreating the function on every render
  const renderOption = React.useCallback(
    (option: { value: string; title: string }, index: number) => {
      return (
        <MultipleChoiceOptionTemplate
          key={index}
          value={option.value}
          title={option.title}
          checked={valueAtPath === option.value}
          onChange={handleChange}
          disabled={schema.readOnly}
        />
      );
    },
    [valueAtPath, handleChange, schema.readOnly]
  );

  if (readonly) {
    const selectedOption =
      schema.enum?.find((opt) => opt === valueAtPath) ||
      schema.oneOf?.find((opt) => opt.const === valueAtPath)?.title ||
      valueAtPath;
    return (
      <ReadonlyPrimitiveTemplate
        title={schema.title ?? undefined}
        value={selectedOption}
        description={schema.description ?? undefined}
      />
    );
  }

  return (
    <div style={WrapperStyle}>
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      <div>{opts.map((option, index) => renderOption(option, index))}</div>
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

/**
 * TextareaTemplate
 * Renders a textarea input for multi-line string input.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the textarea field.
 * @param {string[]} props.path - The path to the textarea field in the form data.
 * @returns {JSX.Element} - The textarea field component.
 */
export const TextareaTemplate: React.FC<{
  schema: StringSchema;
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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueAtPath(event.target.value);
  };

  return (
    <div style={WrapperStyle}>
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      <textarea
        value={valueAtPath ?? ""}
        disabled={schema.readOnly}
        onChange={handleChange}
        placeholder={schema.title || ""}
        style={{
          padding: "8px",
          border: "1px solid #d1d5db",
          borderRadius: "0.375rem",
        }}
      />
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

/**
 * SelectTemplate
 * Renders a select dropdown field for string or number schemas with enum or oneOf options.
 * @param {Object} props - The props for the component.
 * @param {StringSchema|NumberSchema} props.schema - The schema for the select field.
 * @param {string[]} props.path - The path to the select field in the form data.
 * @returns {JSX.Element} - The select field component.
 */
export const SelectTemplate: React.FC<{
  schema: StringSchema | NumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, "");
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);
  const size = useWindowSize();

  if (readonly) {
    const selectedOption =
      schema.enum?.find((opt) => opt === valueAtPath) ||
      schema.oneOf?.find((opt) => opt.const === valueAtPath)?.title ||
      valueAtPath;

    return (
      <ReadonlyPrimitiveTemplate
        title={schema.title ?? undefined}
        value={selectedOption}
        description={schema.description ?? undefined}
      />
    );
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValueAtPath(event.target.value);
  };

  return (
    <div
      style={{
        width: size.width && size.width > 640 ? "min-content" : "100%",
        ...WrapperStyle,
      }}
    >
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      <select
        value={valueAtPath}
        disabled={schema.readOnly}
        onChange={handleChange}
        style={{
          width: size.width && size.width > 640 ? "12rem" : "100%",
          padding: "8px",
          border: "1px solid #d1d5db",
          borderRadius: "0.375rem",
          boxSizing: "border-box",
        }}
      >
        <option value=""></option>
        {schema.enum
          ? schema.enum.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))
          : schema.oneOf?.map((option) => (
              <option key={option.const} value={option.const}>
                {option.title}
              </option>
            ))}
      </select>
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

/**
 * NumberTemplate
 * Renders a number input or select field based on the number schema.
 * @param {Object} props - The props for the component.
 * @param {NumberSchema} props.schema - The schema for the number property.
 * @param {string[]} props.path - The path to the number property in the form data.
 * @returns {JSX.Element} - The number template component.
 */
export const NumberTemplate: React.FC<{
  schema: NumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const numberMatchers = [
    {
      matcher: (schema: NumberSchema) => schema.enum || schema.oneOf,
      render: () => <SelectTemplate schema={schema} path={path} />,
    },
    {
      matcher: () => true,
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="number" />
      ),
    },
  ];

  for (const { matcher, render } of numberMatchers) {
    if (matcher(schema)) {
      return render();
    }
  }
  return <InputTemplate schema={schema} path={path} htmlType="number" />;
};

/**
 * BooleanTemplate
 * Renders a checkbox or radio buttons for boolean schemas.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the boolean property.
 * @param {string[]} props.path - The path to the boolean property in the form data.
 * @returns {JSX.Element} - The boolean template component.
 */
export const BooleanTemplate: React.FC<{
  schema: BooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const booleanMatchers = [
    {
      matcher: (schema: BooleanSchema) => !schema.oneOf,
      render: () => <CheckboxTemplate schema={schema} path={path} />,
    },
    {
      matcher: () => true,
      render: () => <RadioTemplate schema={schema} path={path} />,
    },
  ];

  for (const { matcher, render } of booleanMatchers) {
    if (matcher(schema)) {
      return render();
    }
  }
  return <CheckboxTemplate schema={schema} path={path} />;
};

/**
 * RadioTemplate
 * Renders radio buttons for boolean schemas with oneOf options.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the radio boolean field.
 * @param {string[]} props.path - The path to the radio boolean field in the form data.
 * @returns {JSX.Element} - The radio boolean field component.
 */
export const RadioTemplate: React.FC<{
  schema: BooleanSchema;
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
    <div style={WrapperStyle}>
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      {schema.oneOf?.map((option) => (
        <label
          key={option.title}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="radio"
            checked={valueAtPath === option.const}
            disabled={schema.readOnly}
            onChange={() => setValueAtPath(option.const)}
            style={{
              height: "16px",
              width: "16px",
              marginRight: "8px",
            }}
          />
          <span>{option.title}</span>
        </label>
      ))}
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

/**
 * CheckboxTemplate
 * Renders a checkbox for boolean schemas without oneOf options.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the checkbox boolean field.
 * @param {string[]} props.path - The path to the checkbox boolean field in the form data.
 * @returns {JSX.Element} - The checkbox boolean field component.
 */
export const CheckboxTemplate: React.FC<{
  schema: BooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  if (readonly) {
    return (
      <ReadonlyPrimitiveTemplate
        title={schema.title}
        value={valueAtPath ? "true" : "false"}
        description={schema.description}
      />
    );
  }

  return (
    <div style={WrapperStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={valueAtPath}
          disabled={schema.readOnly}
          onChange={(event) => setValueAtPath(event.target.checked)}
          style={{ marginRight: "8px" }}
        />
        {schema.title && (
          <label style={{ fontSize: "0.875rem" }}>{schema.title}</label>
        )}
      </div>
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

/**
 * ObjectTemplate
 * Renders an object schema by delegating to the appropriate template.
 * @param {Object} props - The props for the component.
 * @param {ObjectSchema} props.schema - The schema of the object.
 * @param {string[]} props.path - The path to the object in the form data.
 * @returns {JSX.Element} - The object template component.
 */
export const ObjectTemplate: React.FC<{
  schema: ObjectSchema;
  path: string[];
}> = ({ schema, path }) => {
  return <SimpleObjectTemplate schema={schema} path={path} />;
};

/**
 * SimpleObjectTemplate
 * Renders a simple object schema by rendering each property.
 * @param {Object} props - The props for the component.
 * @param {ObjectSchema} props.schema - The schema of the object.
 * @param {string[]} props.path - The path to the object in the form data.
 * @returns {JSX.Element} - The simple object template component.
 */
export const SimpleObjectTemplate: React.FC<{
  schema: ObjectSchema;
  path: string[];
}> = ({ schema, path }) => {
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);
  const RenderTemplate = useRenderTemplate();

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
              schema={schema.properties?.[key] as FormgenJSONSchema7}
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
    <div
      style={{
        width: "100%",
        ...WrapperStyle,
      }}
    >
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
      <div
        style={{
          border: "0.125rem solid",
          padding: "1rem",
          ...ComplexWrapperStyle,
        }}
      >
        {schema.properties &&
          Object.keys(schema.properties).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.properties?.[key] as FormgenJSONSchema7}
              path={[...path, key]}
            />
          ))}
      </div>
    </div>
  );
};

/**
 * ArrayTemplate
 * Renders an array field, choosing the appropriate template based on the schema.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The array template component.
 */
export const ArrayTemplate: React.FC<{
  schema: ArraySchema;
  path: string[];
}> = ({ schema, path }) => {
  const arrayMatchers = [
    {
      matcher: (schema: ArraySchema) => Array.isArray(schema.items),
      render: () => <TupleArrayTemplate schema={schema} path={path} />,
    },
    {
      matcher: (schema: ArraySchema) =>
        schema.uniqueItems &&
        schema.items &&
        !Array.isArray(schema.items) &&
        typeof schema.items === "object" &&
        ((schema.items as FormgenJSONSchema7).enum ||
          (schema.items as FormgenJSONSchema7).oneOf),
      render: () => <MultiSelectCheckboxTemplate schema={schema} path={path} />,
    },
    {
      matcher: () => true,
      render: () => <SimpleArrayTemplate schema={schema} path={path} />,
    },
  ];

  for (const { matcher, render } of arrayMatchers) {
    if (matcher(schema)) {
      return render();
    }
  }

  return <SimpleArrayTemplate schema={schema} path={path} />;
};

/**
 * TupleArrayTemplate
 * Renders a tuple array where each item has a different schema.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The tuple array template component.
 */
export const TupleArrayTemplate: React.FC<{
  schema: ArraySchema;
  path: string[];
}> = ({ schema, path }) => {
  // To account for the elements of the tuple array having their respective data generated at form creation and the effect this has on validation, we need to first check if this tuple is a required property. If it's not, then we should reset the tuple's initial data to an empty array.
  const rootSchema = useFormContext((state: FormState) => state.schema);
  // We can use the current path and cross reference it with the root schema to determine if this tuple instance is a required property of its parent object.
  const parentPath = path.slice(0, -1);
  // We'll get the parent schema by iterating through the root schema using the parent path, resolving any $ref schemas along the way.
  let parentSchema = rootSchema;
  for (const key of parentPath) {
    const newSchema =
      parentSchema.type === "object"
        ? (resolveSchema(
            parentSchema.properties?.[key] as FormgenJSONSchema7,
            rootSchema.definitions
          ) as FormgenJSONSchema7)
        : (resolveSchema(
            parentSchema.items as FormgenJSONSchema7,
            rootSchema.definitions
          ) as FormgenJSONSchema7);

    parentSchema = newSchema;
  }

  const isRequired = parentSchema?.required?.includes(path[path.length - 1]);

  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path);
  const [parentValue, setParentValue] = useFormDataAtPath(parentPath);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);
  const RenderTemplate = useRenderTemplate();

  return (
    <div
      style={{
        width: "100%",
        ...WrapperStyle,
      }}
    >
      {valueAtPath ? (
        <>
          {schema.title && (
            <label style={{ fontWeight: "600" }}>{schema.title}</label>
          )}
          {schema.description && <small>{schema.description}</small>}
          <div
            style={{
              marginBottom: "16px",
              width: "100%",
              ...ComplexWrapperStyle,
            }}
          >
            {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
            {Array.isArray(schema.items) &&
              schema.items.map((itemSchema, index) => (
                <RenderTemplate
                  key={index}
                  schema={itemSchema as FormgenJSONSchema7}
                  path={[...path, index.toString()]}
                />
              ))}
          </div>
          {/* If the tuple is not required, render a button to remove it */}
          {!readonly && !isRequired && valueAtPath && (
            <button
              onClick={() =>
                setParentValue({
                  ...parentValue,
                  [path[path.length - 1]]: undefined,
                })
              }
              type="button"
              style={{
                width: "100%",
              }}
            >
              Remove {schema.title ?? path[path.length - 1]}
            </button>
          )}
        </>
      ) : (
        !readonly && (
          <button
            onClick={() => setValueAtPath([])}
            type="button"
            style={{
              width: "100%",
            }}
          >
            Add {schema.title ?? path[path.length - 1]}
          </button>
        )
      )}
    </div>
  );
};

/**
 * MultiSelectCheckboxTemplate
 * Renders a set of checkboxes for multi-select arrays with unique items.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The multi-select checkbox component.
 */
export const MultiSelectCheckboxTemplate: React.FC<{
  schema: ArraySchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, []);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  const options = React.useMemo(() => {
    if (typeof schema.items === "object" && !Array.isArray(schema.items)) {
      if ("enum" in schema.items && schema.items.enum) {
        return schema.items.enum.map((option) => ({
          value: option,
          label: option,
        }));
      } else if ("oneOf" in schema.items && schema.items.oneOf) {
        return schema.items.oneOf
          .filter(
            (item): item is FormgenJSONSchema7 =>
              typeof item === "object" && !Array.isArray(item)
          )
          .map((option) => ({
            value: option.const,
            label: option.title,
          }));
      }
    }
    return [];
  }, [schema]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const updatedValues = valueAtPath.includes(selectedValue)
      ? valueAtPath.filter((item: string) => item !== selectedValue)
      : [...valueAtPath, selectedValue];
    setValueAtPath(updatedValues);
  };

  return (
    <div style={WrapperStyle}>
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      {schema.description && <small>{schema.description}</small>}
      <div style={{ marginTop: "8px" }}>
        {options
          .filter(
            (option) => option.value !== undefined && option.label !== undefined
          )
          .map((option) => (
            <div
              key={String(option.value)}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <input
                type="checkbox"
                value={String(option.value)}
                checked={valueAtPath.includes(option.value)}
                onChange={handleChange}
                disabled={readonly}
                style={{ marginRight: "8px" }}
              />
              <label style={{ fontSize: "14px" }}>{String(option.label)}</label>
            </div>
          ))}
      </div>
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

/**
 * MultiSelectTemplate
 * Renders a multi-select dropdown for arrays with unique items.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The multi-select field component.
 */
export const MultiSelectTemplate: React.FC<{
  schema: ArraySchema;
  path: string[];
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, []);
  const errorsAtPath = useErrorsAtPath(path);
  const readonly = useFormContext((state: FormState) => state.readonly);

  const options = React.useMemo(() => {
    if (typeof schema.items === "object" && !Array.isArray(schema.items)) {
      if ("enum" in schema.items && schema.items.enum) {
        return schema.items.enum.map((option) => ({
          value: option,
          label: option,
        }));
      } else if ("oneOf" in schema.items && schema.items.oneOf) {
        return schema.items.oneOf
          .filter(
            (item): item is FormgenJSONSchema7 =>
              typeof item === "object" && !Array.isArray(item)
          )
          .map((option) => ({
            value: option.const,
            label: option.title,
          }));
      }
    }
    return [];
  }, [schema]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setValueAtPath(selectedOptions);
  };

  return (
    <div style={WrapperStyle}>
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      {schema.description && <small>{schema.description}</small>}
      <select
        multiple
        value={valueAtPath}
        onChange={handleChange}
        disabled={readonly}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
        }}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {String(option.label)}
          </option>
        ))}
      </select>
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
    </div>
  );
};

/**
 * SimpleArrayTemplate
 * Renders an array schema where items are of the same type.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema of the array.
 * @param {string[]} props.path - The path to the array in the form data.
 * @returns {JSX.Element} - The simple array template component.
 */
export const SimpleArrayTemplate: React.FC<{
  schema: ArraySchema;
  path: string[];
}> = ({ schema, path }) => {
  const readonly = useFormContext((state: FormState) => state.readonly);
  const definitions = useFormContext(
    (state: FormState) => state.schema.definitions || {}
  );
  const RenderTemplate = useRenderTemplate();

  const { valueAtPath, errorsAtPath, moveItem, removeItem, addItem } =
    useArrayTemplate(path, () =>
      generateInitialData(schema.items as FormgenJSONSchema7, definitions)
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
                schema={schema.items as FormgenJSONSchema7}
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
    <div
      style={{
        width: "100%",
        ...WrapperStyle,
      }}
    >
      {schema.title && (
        <label style={{ fontWeight: "600" }}>{schema.title}</label>
      )}
      {schema.description && <small>{schema.description}</small>}
      {errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
      <div
        style={{
          border: "0.25rem dashed",
          padding: "1rem",
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
                width: "100%",
              }}
              key={index}
            >
              <RenderTemplate
                schema={schema.items as FormgenJSONSchema7}
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
        <button
          type="button"
          onClick={addItem}
          style={{
            width: "100%",
          }}
        >
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
 * BaseFormRoot
 * The root form component that renders the form based on the schema and handles submission.
 * @param {FormRootProps} props - The props for the BaseFormRoot.
 * @param {Function} props.onSubmit - Callback function when form is submitted successfully.
 * @param {Function} props.onError - Callback function when form submission has errors.
 * @returns {JSX.Element} - The form component.
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
  const [formBorder, setFormBorder] = React.useState<string>("none");

  if (readonly) {
    return (
      <div style={{ padding: "1rem", ...ComplexWrapperStyle }}>
        {Object.keys(schema.properties || {}).map((key) => (
          <RenderTemplate
            key={key}
            schema={schema.properties?.[key] as FormgenJSONSchema7}
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
      setFormBorder("1px solid green");
      setErrors(null);
      onSubmit(formData);
    } else {
      setFormBorder("1px solid red");
      setErrors(validate.errors ?? null);
      onError(validate.errors ?? [], formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "1rem",
        border: formBorder,
        ...ComplexWrapperStyle,
      }}
    >
      {Object.keys(schema.properties || {}).map((key) => (
        <RenderTemplate
          key={key}
          schema={schema.properties?.[key] as FormgenJSONSchema7}
          path={[key]}
        />
      ))}
      <button
        type="submit"
        style={{
          width: "100%",
        }}
      >
        Submit
      </button>
    </form>
  );
};
