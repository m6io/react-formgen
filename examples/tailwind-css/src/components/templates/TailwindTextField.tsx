import { useFormContext, StringSchema } from "@m6oss/schema-form";
import { TailwindErrorMessage } from "./TailwindErrorMessage";

/**
 * Text Field Component Template
 * @param {StringSchema} schema - The schema for the text field.
 * @param {string[]} path - The path to the text field in the form data.
 * @returns {JSX.Element} - The text field component.
 * @example
 * <TailwindTextField schema={schema} path={path} />
 *
 */
export const TailwindTextField: React.FC<{
  schema: StringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? null;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.value);
  };

  return (
    <div className="flex flex-col">
      {schema.title && <label className="font-semibold">{schema.title}</label>}
      <input
        type="text"
        value={valueAtPath ?? ""}
        onChange={handleChange}
        placeholder={schema.title || ""}
        list={
          Array.isArray(schema.examples)
            ? `${path.join("-")}-datalist`
            : undefined
        }
        className="w-48 p-2 border border-gray-300 rounded"
      />
      {schema.description && (
        <small className="text-gray-500">{schema.description}</small>
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
