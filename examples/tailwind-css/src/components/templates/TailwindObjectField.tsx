import { BaseObjectSchema, useFieldErrors } from "@m6oss/schema-form";
import { SchemaDefinitions } from "@m6oss/schema-form";
import { JSONSchema7, CustomFields } from "@m6oss/schema-form";
import { renderField } from "@m6oss/schema-form";

/**
 * Object Field Component Template
 * @param {BaseObjectSchema} schema - The schema for the object field.
 * @param {string[]} path - The path to the object field in the form data.
 * @param {SchemaDefinitions} definitions - The definitions object from the schema.
 * @param {CustomFields} customFields - The custom fields object.
 * @returns {JSX.Element} - The object field component.
 * @example
 * <TailwindObjectField schema={schema} path={path} definitions={definitions} customFields={customFields} />
 *
 */
export const TailwindObjectField: React.FC<{
  schema: BaseObjectSchema;
  path: string[];
  definitions: SchemaDefinitions;
  customFields?: CustomFields;
}> = ({ schema, path, definitions, customFields = {} }) => {
  const errorsAtPath = useFieldErrors(path);

  return (
    <div className="border border-gray-300 dark:border-gray-600 p-4 my-4 flex flex-col">
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
      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div key={index} className="text-red-500 dark:text-red-400">
            {error.message}
          </div>
        ))}
      <br />
      {schema.properties &&
        Object.keys(schema.properties).map((key) => (
          <div key={key}>
            {renderField(
              schema.properties?.[key] as JSONSchema7,
              [...path, key],
              definitions,
              customFields
            )}
          </div>
        ))}
    </div>
  );
};
