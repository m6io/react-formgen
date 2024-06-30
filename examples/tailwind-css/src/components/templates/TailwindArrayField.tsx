import { SchemaDefinitions, useArrayField } from "@m6oss/schema-form";
import { JSONSchema7, BaseArraySchema, CustomFields } from "@m6oss/schema-form";
import { renderField } from "@m6oss/schema-form";
import { HiX, HiChevronDown, HiChevronUp } from "react-icons/hi";

/**
 * Array Field Component Template
 * @param {BaseArraySchema} schema - The schema for the array field.
 * @param {string[]} path - The path to the array field in the form data.
 * @param {SchemaDefinitions} definitions - The definitions object from the schema.
 * @param {CustomFields} customFields - The custom fields object.
 * @returns {JSX.Element} - The array field component.
 * @example
 * <TailwindArrayField schema={schema} path={path} definitions={definitions} customFields={customFields} />
 */
export const TailwindArrayField: React.FC<{
  schema: BaseArraySchema;
  path: string[];
  definitions: SchemaDefinitions;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
  const { valueAtPath, errorsAtPath, moveItem, removeItem, addItem } =
    useArrayField(path, schema, definitions, []);

  return (
    <div className="border-dashed rounded-xl border-2 border-gray-400 dark:border-gray-600 p-4 my-4 flex flex-col">
      {schema.title && (
        <label className="font-semibold dark:text-zinc-200">
          {schema.title}
        </label>
      )}
      {schema.description && (
        <small className="text-gray-500 dark:text-gray-400">
          {schema.description}
        </small>
      )}
      <br />
      {schema.items &&
        Array.isArray(valueAtPath) &&
        valueAtPath.map((_, index: number) => (
          <div className="relative p-4 my-2" key={index}>
            <button
              type="button"
              className="absolute top-4 right-0 bg-red-500 text-white size-10 flex items-center justify-center hover:bg-red-600 dark:hover:bg-red-700"
              onClick={() => removeItem(index)}
            >
              <HiX />
            </button>
            <button
              type="button"
              className="absolute top-4 right-10 bg-blue-500 text-white size-10 flex items-center justify-center disabled:opacity-50 hover:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => moveItem(index, "up")}
              disabled={index === 0}
            >
              <HiChevronUp />
            </button>
            <button
              type="button"
              className="absolute top-4 right-20 bg-blue-500 text-white size-10 flex items-center justify-center disabled:opacity-50 hover:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => moveItem(index, "down")}
              disabled={index === valueAtPath.length - 1}
            >
              <HiChevronDown />
            </button>

            {renderField(
              schema.items as JSONSchema7,
              [...path, index.toString()],
              definitions,
              customFields
            )}
          </div>
        ))}
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded dark:bg-blue-600"
        type="button"
        onClick={addItem}
      >
        Add Item
      </button>
      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div key={index} className="text-red-500 dark:text-red-400">
            {error.message}
          </div>
        ))}
    </div>
  );
};
