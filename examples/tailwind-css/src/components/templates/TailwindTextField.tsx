import { useFormContext, StringSchema } from "@m6oss/schema-form";
import { TailwindErrorMessage } from "./TailwindErrorMessage";

/**
 * Custom OneOf type for string fields.
 * @typedef {Object} StringOneOf
 * @property {string} const - The value of the string field.
 * @property {string} title - The title of the string field.
 *
 */
type StringOneOf = {
  const: string;
  title: string;
};

/**
 * Represents a new string schema with additional UI options.
 * @typedef {Object} NewStringSchema
 * @extends {StringSchema}
 * @property {"textarea"} [uiSchema] - The UI schema for the string field.
 */
interface NewStringSchema extends StringSchema {
  uiSchema?: "textarea" | "tel";
  oneOf?: StringOneOf[];
  enum?: string[];
}

export const TailwindTextField: React.FC<{
  schema: NewStringSchema;
  path: string[];
}> = ({ schema, path }) => {
  // Early return if the schema has oneOf or enum options.
  if (schema.enum || schema.oneOf) {
    return <TailwindSelectField schema={schema} path={path} />;
  } // Check if the schema has a format of date, datetime, or date-time. If so, return the TailwindDateField component.
  else if (
    schema.format &&
    ["date", "datetime", "date-time"].includes(schema.format)
  ) {
    return <TailwindDateField schema={schema} path={path} />;
  } // Check if the schema has a uiSchema of textarea. If so, return the TailwindTextareaField component.
  else if (schema.uiSchema === "textarea") {
    return <TailwindTextareaField schema={schema} path={path} />;
  }
  return <TailwindInputField schema={schema} path={path} />;
};

/**
 * Input Field Component Template
 * @param {NewStringSchema} schema - The schema for the input field.
 * @param {string[]} path - The path to the input field in the form data.
 * @returns {JSX.Element} - The input field component.
 * @example
 * <TailwindInputField schema={schema} path={path} />
 */
const TailwindInputField: React.FC<{
  schema: NewStringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? null;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.value);
  };

  const inputType =
    schema.format && ["password", "email", "url"].includes(schema.format)
      ? schema.format
      : schema.uiSchema === "tel"
        ? "tel"
        : "text";

  return (
    <div className="flex flex-col">
      {schema.title && (
        <label className="font-semibold dark:text-zinc-200">
          {schema.title}
        </label>
      )}
      <input
        type={inputType}
        value={valueAtPath ?? ""}
        onChange={handleChange}
        placeholder={schema.title || ""}
        list={
          Array.isArray(schema.examples)
            ? `${path.join("-")}-datalist`
            : undefined
        }
        className="w-48 p-2 border border-zinc-300 rounded dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 bg-white dark:bg-zinc-800"
      />
      {schema.description && (
        <small className="text-zinc-500 dark:text-zinc-400">
          {schema.description}
        </small>
      )}
      {Array.isArray(schema.examples) && (
        <datalist id={`${path.join("-")}-datalist`}>
          {schema.examples.map((example, index) => (
            <option key={index} value={example as string} />
          ))}
        </datalist>
      )}
      <TailwindErrorMessage path={path} />
    </div>
  );
};

/**
 * Textarea Field Component Template
 * @param {NewStringSchema} schema - The schema for the textarea field.
 * @param {string[]} path - The path to the textarea field in the form data.
 * @returns {JSX.Element} - The textarea field component.
 * @example
 * <TailwindTextareaField schema={schema} path={path} />
 */
const TailwindTextareaField: React.FC<{
  schema: NewStringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? null;
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(path, event.target.value);
  };

  return (
    <div className="flex flex-col">
      {schema.title && (
        <label className="font-semibold dark:text-zinc-200">
          {schema.title}
        </label>
      )}
      <textarea
        value={valueAtPath ?? ""}
        onChange={handleChange}
        placeholder={schema.title || ""}
        className="w-48 p-2 border border-zinc-300 rounded dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 bg-white dark:bg-zinc-800"
      />
      {schema.description && (
        <small className="text-zinc-500 dark:text-zinc-400">
          {schema.description}
        </small>
      )}
      <TailwindErrorMessage path={path} />
    </div>
  );
};

/**
 * Select Field Component Template
 * @param {NewStringSchema} schema - The schema for the select field.
 * @param {string[]} path - The path to the select field in the form data.
 * @returns {JSX.Element} - The select field component.
 * @example
 * <TailwindSelectField schema={schema} path={path} />
 */
const TailwindSelectField: React.FC<{
  schema: NewStringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? "";

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(path, event.target.value);
  };

  return (
    <div className="flex flex-col">
      {schema.title && (
        <label className="font-semibold dark:text-zinc-200">
          {schema.title}
        </label>
      )}
      <select
        value={valueAtPath}
        onChange={handleChange}
        className="w-48 p-2 border border-zinc-300 rounded dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 bg-white dark:bg-zinc-800"
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
      {schema.description && (
        <small className="text-zinc-500 dark:text-zinc-400">
          {schema.description}
        </small>
      )}
      <TailwindErrorMessage path={path} />
    </div>
  );
};

/**
 * Date Field Component Template
 * @param {NewStringSchema} schema - The schema for the date field.
 * @param {string[]} path - The path to the date field in the form data.
 * @returns {JSX.Element} - The date field component.
 * @example
 * <TailwindDateField schema={schema} path={path} />
 */
const TailwindDateField: React.FC<{
  schema: NewStringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.value);
  };

  const inputType =
    schema.format === "datetime" ? "datetime-local" : schema.format;

  return (
    <div className="flex flex-col">
      {schema.title && (
        <label className="font-semibold dark:text-zinc-200">
          {schema.title}
        </label>
      )}
      <input
        type={inputType}
        value={valueAtPath}
        onChange={handleChange}
        placeholder={schema.title || ""}
        className="w-48 p-2 border border-zinc-300 rounded dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 bg-white dark:bg-zinc-800"
      />
      {schema.description && (
        <small className="text-zinc-500 dark:text-zinc-400">
          {schema.description}
        </small>
      )}
      <TailwindErrorMessage path={path} />
    </div>
  );
};
