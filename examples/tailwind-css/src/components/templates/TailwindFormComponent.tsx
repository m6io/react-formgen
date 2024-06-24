import { ErrorObject } from "@m6oss/schema-form";
import { useFormContext, JSONSchema7, CustomFields } from "@m6oss/schema-form";
import { renderField } from "@m6oss/schema-form";
import { AjvInstance } from "@m6oss/schema-form";

/**
 * Form Component Template
 * @param {Function} onSubmit - The function to call when the form is submitted.
 * @param {Function} onError - The function to call when the form has errors.
 * @param {CustomFields} customFields - The custom fields object.
 * @returns {JSX.Element} - The form component.
 * @example
 * <TailwindFormComponent onSubmit={onSubmit} onError={onError} customFields={customFields} />
 *
 */
export const TailwindFormComponent: React.FC<{
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: ErrorObject[]) => void;
  customFields?: CustomFields;
}> = ({ onSubmit, onError, customFields = {} }) => {
  const schema = useFormContext((state) => state.schema);
  const formData = useFormContext((state) => state.formData);
  const setErrors = useFormContext((state) => state.setErrors);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validate = AjvInstance.compile(schema);
    const valid = validate(formData);
    if (valid) {
      setErrors(null);
      onSubmit(formData);
    } else {
      setErrors(validate.errors ?? null);
      onError(validate.errors ?? []);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(schema.properties || {}).map((key) => (
        <div key={key} className="mb-4">
          {renderField(
            schema.properties?.[key] as JSONSchema7,
            [key],
            schema.definitions || {},
            customFields
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded dark:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};
