import { SchemaDefinitions, getZeroState } from "@m6oss/schema-form";
import {
  useFormContext,
  JSONSchema7,
  ArraySchema,
  CustomFields,
} from "@m6oss/schema-form";
import { renderField } from "@m6oss/schema-form";
import { TailwindErrorMessage } from "./TailwindErrorMessage";

/**
 * Array Field Component Template
 * @param {ArraySchema} schema - The schema for the array field.
 * @param {string[]} path - The path to the array field in the form data.
 * @param {SchemaDefinitions} definitions - The definitions object from the schema.
 * @param {CustomFields} customFields - The custom fields object.
 * @returns {JSX.Element} - The array field component.
 * @example
 * <TailwindArrayField schema={schema} path={path} definitions={definitions} customFields={customFields} />
 */
export const TailwindArrayField: React.FC<{
  schema: ArraySchema;
  path: string[];
  definitions: SchemaDefinitions;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? [];

  return (
    <div className="border-dashed border-2 border-gray-400 p-4 my-4 flex flex-col">
      {schema.title && <label className="font-semibold">{schema.title}</label>}
      {schema.description && (
        <small className="text-gray-500">{schema.description}</small>
      )}
      <br />
      {schema.items &&
        Array.isArray(valueAtPath) &&
        valueAtPath.map((_, index: number) => (
          <div
            className="border-dotted border-2 border-lime-500 p-4 my-2"
            key={index}
          >
            {renderField(
              schema.items as JSONSchema7,
              [...path, index.toString()],
              definitions,
              customFields
            )}
            <button
              type="button"
              className="mt-2 text-red-500"
              onClick={() => {
                const newArray = [...valueAtPath];
                newArray.splice(index, 1);
                setFormData(path, newArray);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        type="button"
        onClick={() => {
          setFormData(path, [
            ...valueAtPath,
            getZeroState(schema.items as JSONSchema7, definitions),
          ]);
        }}
      >
        Add Item
      </button>
      <TailwindErrorMessage path={path} />
    </div>
  );
};
