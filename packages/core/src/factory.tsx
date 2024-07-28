import React from "react";
import {
  FormProvider as CoreFormProvider,
  FormState,
  FormProviderProps,
} from "./components/FormProvider";
import { useFormContext as coreUseFormContext } from "./hooks/useFormContext";
import { useFormDataAtPath as coreUseFormDataAtPath } from "./hooks/useFormDataAtPath";
import { useErrorsAtPath as coreUseErrorsAtPath } from "./hooks/useErrorsAtPath";
import { useArrayFieldset as coreUseArrayFieldset } from "./hooks/useArrayFieldset";

/**
 * Factory function to create schema-specific form provider and hooks.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 * @param {(schema: S) => any} generateInitialData - Function to generate initial data from the schema.
 * @param {(errors: E[], path: string[]) => E[] | undefined} getErrorsAtPath - Function to get errors at a specific path.
 * @returns {Object} An object containing schema-specific FormProvider, useFormContext, useFormDataAtPath, useErrorsAtPath, and useArrayFieldset hooks.
 * @example
 * ```ts
 * const { FormProvider, useFormContext, useFormDataAtPath, useErrorsAtPath, useArrayFieldset } = createFormProviderAndHooks(generateInitialData, getErrorsAtPath);
 */
export const createFormProviderAndHooks = <S, E>(
  generateInitialData: (schema: S) => any,
  getErrorsAtPath: (errors: E[], path: string[]) => E[] | undefined
) => {
  /**
   * Schema-specific FormProvider component.
   *
   * @param {Omit<FormProviderProps<S>, "createInitialData">} props - Props for the FormProvider component.
   * @returns {JSX.Element} A React component that provides the form state context.
   * @example
   * ```
   * const { FormProvider } = createFormProviderAndHooks(generateInitialData, getErrorsAtPath);
   * <FormProvider schema={mySchema} initialData={myInitialData}>
   *   <MyFormComponent />
   * </FormProvider>
   * ```
   */
  const FormProvider: React.FC<
    Omit<FormProviderProps<S>, "createInitialData">
  > = ({ initialData = {}, schema, children }) => {
    return (
      <CoreFormProvider<S, E>
        initialData={initialData}
        schema={schema}
        generateInitialData={generateInitialData}
      >
        {children}
      </CoreFormProvider>
    );
  };

  /**
   * Custom hook to access the form state from the context.
   *
   * @template T - The type of the selected part of the form state.
   * @param {(state: FormState<S, E>) => T} selector - Selector function to pick a part of the form state.
   * @returns {T} The selected part of the form state.
   * @example
   * ```
   * const formData = useFormContext(state => state.formData);
   * ```
   */
  const useFormContext = <T,>(selector: (state: FormState<S, E>) => T): T => {
    return coreUseFormContext<S, E, T>(selector);
  };

  /**
   * Custom hook to get and set form data at a specific path in the form state.
   *
   * @param {string[]} path - Path to the form data.
   * @param {unknown} defaultOnNull - Default value if the data at the path is null.
   * @returns {[any, (value: any) => void]} A tuple containing the data at the path and a function to set the data at the path.
   * @example
   * ```
   * const [value, setValue] = useFormDataAtPath(["field1", "field2"]);
   * ```
   */
  const useFormDataAtPath = (
    path: string[],
    defaultOnNull: unknown = null
  ): [any, (value: any) => void] => {
    return coreUseFormDataAtPath<S, E>(path, defaultOnNull);
  };

  /**
   * Custom hook to retrieve validation errors at a specific path in the form state.
   *
   * @param {string[]} path - Path to the errors in the form state.
   * @returns {E[] | undefined} The errors at the specified path, if any.
   * @example
   * ```
   * const errors = useErrorsAtPath(["field1", "field2"]);
   * ```
   */
  const useErrorsAtPath = (path: string[]): E[] | undefined => {
    return coreUseErrorsAtPath<S, E>(path, getErrorsAtPath);
  };

  /**
   * Custom hook to manage array fields within the form state.
   *
   * @param {string[]} path - Path to the array data in the form state.
   * @param {() => any} zeroState - Function to get the initial state for a new array item.
   * @param {any} defaultOnNull - Default value if the data at the path is null.
   * @returns {Object} An object containing the array data, errors at the path, and functions to manipulate the array.
   * @example
   * ```
   * const { valueAtPath, addItem, removeItem, moveItem } = useArrayFieldset(["arrayField"], () => ({}));
   * ```
   */
  const useArrayFieldset = (
    path: string[],
    zeroState: () => any,
    defaultOnNull: any = null
  ) => {
    return coreUseArrayFieldset<S, E>(
      path,
      zeroState,
      defaultOnNull,
      getErrorsAtPath
    );
  };

  return {
    FormProvider,
    useFormContext,
    useFormDataAtPath,
    useErrorsAtPath,
    useArrayFieldset,
  };
};
