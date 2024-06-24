import { BooleanSchema } from "@m6oss/schema-form";
import { useFormContext } from "@m6oss/schema-form";
import { TailwindErrorMessage } from "./TailwindErrorMessage";

/**
 * Boolean Field Component Template
 * @param {BooleanSchema} schema - The schema for the boolean field.
 * @param {string[]} path - The path to the boolean field in the form data.
 * @returns {JSX.Element} - The boolean field component.
 * @example
 * <TailwindBooleanField schema={schema} path={path} />
 *
 */
export const TailwindBooleanField: React.FC<{
  schema: BooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? false;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.checked);
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <input
          type="checkbox"
          checked={valueAtPath}
          onChange={handleChange}
          className="shrink-0 mt-0.5 border-zinc-200 rounded   dark:bg-neutral-800 dark:border-neutral-700  dark:focus:ring-offset-zinc-800"
        />
        {schema.title && (
          <label className="text-sm text-zinc-500 ms-3 dark:text-neutral-400">
            {" "}
            {schema.title}
          </label>
        )}
      </div>
      {schema.description && (
        <small className="text-zinc-500 dark:text-zinc-400">
          {schema.description}
        </small>
      )}
      <TailwindErrorMessage path={path} />
    </div>
  );
};
