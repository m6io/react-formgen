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
 * @template S - Schema type.
 * @template E - Error type.
 * @param {(schema: S) => any} generateInitialData - Function to generate initial data from schema.
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
   * @param {Omit<FormProviderProps<S>, "createInitialData">} props - Props for the FormProvider.
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
   * Schema-specific hook to access form context.
   * @template T - Return type of the selector function.
   * @param {(state: FormState<S, E>) => T} selector - Selector function to select a part of the form state.
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
   * Schema-specific hook to get form data at a specific path.
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
   * Schema-specific hook to get errors at a specific path.
   * @param {string[]} path - Path to the errors.
   * @returns {E[] | undefined} The errors at the path.
   * @example
   * ```
   * const errors = useErrorsAtPath(["field1", "field2"]);
   * ```
   */
  const useErrorsAtPath = (path: string[]): E[] | undefined => {
    return coreUseErrorsAtPath<S, E>(path, getErrorsAtPath);
  };

  /**
   * Schema-specific hook for array manipulation.
   * @param {string[]} path - Path to the array data.
   * @param {() => any} zeroState - Function to get the zero state for the array items.
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
