import { NumberSchema } from "@m6oss/schema-form";
import { useFormContext } from "@m6oss/schema-form";
import { TailwindErrorMessage } from "./TailwindErrorMessage";

/**
 * Number Field Component Template
 * @param {NumberSchema} schema - The schema for the number field.
 * @param {string[]} path - The path to the number field in the form data.
 * @returns {JSX.Element} - The number field component.
 * @example
 * <TailwindNumberField schema={schema} path={path} />
 *
 */
export const TailwindNumberField: React.FC<{
  schema: NumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? null;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.value ? Number(event.target.value) : null);
  };

  return (
    <div className="flex flex-col">
      {schema.title && (
        <label className="font-semibold dark:text-zinc-200">
          {schema.title}
        </label>
      )}
      <input
        type="number"
        value={valueAtPath ?? ""}
        onChange={handleChange}
        placeholder={schema.title || ""}
        list={
          Array.isArray(schema.examples)
            ? `${path.join("-")}-datalist`
            : undefined
        }
        className="w-24 p-2 border border-zinc-300 rounded dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 bg-white dark:bg-zinc-800"
      />
      {schema.description && (
        <small className="text-gray-500 dark:text-gray-400">
          {schema.description}
        </small>
      )}
      {Array.isArray(schema.examples) && (
        <datalist id={`${path.join("-")}-datalist`}>
          {schema.examples.map((example, index) => (
            <option key={index} value={example as number} />
          ))}
        </datalist>
      )}
      <TailwindErrorMessage path={path} />
    </div>
  );
};
