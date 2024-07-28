import React from "react";
import {
  createFormStore,
  FormState,
  FormProviderProps,
  FormStore,
  FormContext,
} from "./components/FormProvider";
import { useFormContext as coreUseFormContext } from "./hooks/useFormContext";
import { useFormDataAtPath as coreUseFormDataAtPath } from "./hooks/useFormDataAtPath";

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
    const storeRef = React.useRef<FormStore<S, E>>();
    if (!storeRef.current) {
      storeRef.current = createFormStore(
        initialData,
        schema,
        generateInitialData
      );
    }

    return (
      <FormContext.Provider value={storeRef.current}>
        {children}
      </FormContext.Provider>
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
    const errors = useFormContext((state) => state.errors);
    return getErrorsAtPath(errors ?? [], path);
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
    const [valueAtPath, setValueAtPath] = useFormDataAtPath(
      path,
      defaultOnNull
    );
    const errorsAtPath = useErrorsAtPath(path);

    const moveItem = (index: number, direction: "up" | "down") => {
      const newArray = [...valueAtPath];
      const [movedItem] = newArray.splice(index, 1);
      newArray.splice(direction === "up" ? index - 1 : index + 1, 0, movedItem);
      setValueAtPath(newArray);
    };

    const removeItem = (index: number) => {
      const newArray = [...valueAtPath];
      newArray.splice(index, 1);
      setValueAtPath(newArray);
    };

    const addItem = () => {
      setValueAtPath([...valueAtPath, zeroState()]);
    };

    return {
      valueAtPath,
      errorsAtPath,
      moveItem,
      removeItem,
      addItem,
    };
  };

  return {
    FormProvider,
    useFormContext,
    useFormDataAtPath,
    useErrorsAtPath,
    useArrayFieldset,
  };
};
