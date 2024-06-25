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
  // Early return if no oneOf options. This is the default boolean field.
  if (!schema.oneOf) {
    return <TailwindCheckboxBooleanField schema={schema} path={path} />;
  }

  // Return the appropriate boolean field based on the uiSchema.
  switch (schema.uiSchema) {
    case "radio":
      return <TailwindRadioBooleanField schema={schema} path={path} />;
    case "switch":
      return <TailwindSwitchBooleanField schema={schema} path={path} />;
    default: // in the case that the uiSchema does not match radio or switch
      return <TailwindCheckboxBooleanField schema={schema} path={path} />;
  }
};

/**
 * Radio Boolean Field Component Template.
 *
 * For schemas defined like this:
 * ```json
 *    {
 *      "type": "boolean",
 *      "uiSchema": "radio",
 *      "oneOf": [
 *        {
 *          "const": true,
 *          "title": "Yes"
 *        },
 *        {
 *          "const": false,
 *          "title": "No"
 *        }
 *      ]
 *    }
 * ```
 * @param {BooleanSchema} schema - The schema for the radio boolean field.
 * @param {string[]} path - The path to the radio boolean field in the form data.
 * @returns {JSX.Element} - The radio boolean field component.
 * @example
 * <TailwindRadioBooleanField schema={schema} path={path} />
 *
 */
export const TailwindRadioBooleanField: React.FC<{
  schema: BooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? false;

  if (!schema.oneOf || schema.uiSchema !== "radio") {
    return;
  } else {
    return (
      <div className="flex flex-col">
        {schema.title && (
          <label className="font-semibold dark:text-zinc-200">
            {schema.title}
          </label>
        )}
        {schema.oneOf.map((option) => (
          <label
            key={option.title}
            className="flex items-center space-x-2 dark:text-neutral-400"
          >
            <input
              type="radio"
              checked={valueAtPath === option.const}
              onChange={() => setFormData(path, option.const)}
              className="form-radio h-4 w-4 text-zinc-600 dark:bg-neutral-800 dark:border-neutral-700 dark:focus:ring-offset-zinc-800 bg-white border-zinc-200 rounded dark:checked:bg-zinc-600 dark:checked:border-zinc-600 dark:checked:text-zinc-100"
            />
            <span>{option.title}</span>
          </label>
        ))}
        {schema.description && (
          <small className="text-gray-500 dark:text-gray-400">
            {schema.description}
          </small>
        )}
        <TailwindErrorMessage path={path} />
      </div>
    );
  }
};

/**
 * Switch Boolean Field Component Template.
 *
 * For schemas defined like this:
 * ```json
 *    {
 *      "type": "boolean",
 *      "uiSchema": "switch",
 *      "oneOf": [
 *        {
 *          "const": true,
 *          "title": "On"
 *        },
 *        {
 *          "const": false,
 *          "title": "Off"
 *        }
 *      ]
 *    }
 * ```
 * @param {BooleanSchema} schema - The schema for the switch boolean field.
 * @param {string[]} path - The path to the switch boolean field in the form data.
 * @returns {JSX.Element} - The switch boolean field component.
 * @example
 * <TailwindSwitchBooleanField schema={schema} path={path} />
 *
 */
export const TailwindSwitchBooleanField: React.FC<{
  schema: BooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? false;

  if (!schema.oneOf || schema.uiSchema !== "switch") {
    return;
  } else {
    return (
      <div className="flex flex-col">
        {schema.title && (
          <label className="font-semibold dark:text-zinc-200">
            {schema.title}
          </label>
        )}
        <div className="flex">
          <div className="flex items-center">
            <label className="text-sm text-gray-500 me-3 dark:text-neutral-400">
              {schema.oneOf.find((option) => option.const === false)?.title}
            </label>
            <input
              type="checkbox"
              checked={valueAtPath}
              onChange={(event) => setFormData(path, event.target.checked)}
              className="relative w-[35px] h-[21px] bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:size-4 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
            />
            <label className="text-sm text-gray-500 ms-3 dark:text-neutral-400">
              {schema.oneOf.find((option) => option.const === true)?.title}
            </label>
          </div>
        </div>

        {schema.description && (
          <small className="text-gray-500 dark:text-gray-400">
            {schema.description}
          </small>
        )}
        <TailwindErrorMessage path={path} />
      </div>
    );
  }
};

/**
 * Checkbox Boolean Field Component Template.
 *
 * For schemas defined like this:
 * ```json
 *    {
 *      "type": "boolean"
 *    }
 * ```
 * @param {BooleanSchema} schema - The schema for the checkbox boolean field.
 * @param {string[]} path - The path to the checkbox boolean field in the form data.
 * @returns {JSX.Element} - The checkbox boolean field component.
 * @example
 * <TailwindCheckboxBooleanField schema={schema} path={path} />
 *
 */
export const TailwindCheckboxBooleanField: React.FC<{
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
