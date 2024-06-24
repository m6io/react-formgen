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
      <div className="flex gap-2">
        <input type="checkbox" checked={valueAtPath} onChange={handleChange} />
        {schema.title && (
          <label className="font-semibold">{schema.title}</label>
        )}
      </div>
      {schema.description && (
        <small className="text-gray-500">{schema.description}</small>
      )}
      <TailwindErrorMessage path={path} />
    </div>
  );
};
