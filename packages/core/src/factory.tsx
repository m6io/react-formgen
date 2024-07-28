import React, { useContext } from "react";
import { useStore } from "zustand";
import {
  FormContext,
  FormState,
  FormStore,
  createFormStore,
  FormProviderProps,
} from "./components/FormProvider";

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
    const storeRef = React.useRef<FormStore<S, E>>();
    if (!storeRef.current) {
      storeRef.current = createFormStore<S, E>(
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
    const store = useContext(FormContext);
    if (!store) {
      throw new Error("useFormContext must be used within a FormProvider");
    }
    return useStore(store, selector);
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
    const formData = useFormContext((state: FormState<S, E>) => state.formData);
    const setFormData = useFormContext(
      (state: FormState<S, E>) => state.setFormData
    );
    const valueAtPath =
      path.reduce((acc, key) => acc?.[key], formData) ?? defaultOnNull;

    const setValueAtPath = (value: any) => setFormData(path, value);

    return [valueAtPath, setValueAtPath];
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
    const errors = useFormContext((state: FormState<S, E>) => state.errors);
    return getErrorsAtPath(errors ?? [], path);
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
