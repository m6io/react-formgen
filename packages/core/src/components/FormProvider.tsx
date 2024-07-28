import React, { createContext } from "react";
import { createStore } from "zustand";

/**
 * Represents the state of the form.
 * @template S - Schema type.
 * @template E - Error type.
 */
export interface FormState<S, E> {
  schema: S;
  formData: any;
  errors: E[] | null;
  setFormData: (path: string[], value: any) => void;
  setErrors: (errors: E[] | null) => void;
}

/**
 * Props for the FormProvider component.
 * @template S - Schema type.
 */
export interface FormProviderProps<S> {
  initialData?: any;
  schema: S;
  children: React.ReactNode;
  createInitialData: (schema: S) => any;
}

/**
 * Creates a store for the form state.
 * @template S - Schema type.
 * @template E - Error type.
 * @param {any} initialData - Initial form data.
 * @param {S} schema - Form schema.
 * @param {(schema: S) => any} createInitialData - Function to create initial data from schema.
 * @returns {ReturnType<typeof createStore<FormState<S, E>>>} A Zustand store for the form state.
 */
export const createFormStore = <S, E>(
  initialData: any,
  schema: S,
  createInitialData: (schema: S) => any
) => {
  const formData = {
    ...createInitialData(schema),
    ...initialData,
  };

  return createStore<FormState<S, E>>((set) => ({
    schema: schema,
    formData: formData,
    errors: null,
    setFormData: (path, value) =>
      set((state) => {
        const target = { ...state.formData };
        let current = target;

        path.slice(0, -1).forEach((key) => {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        });

        current[path[path.length - 1]] = value;

        return { formData: target };
      }),
    setErrors: (errors) => set({ errors }),
  }));
};

/**
 * Store for the form state.
 * @template S - Schema type.
 * @template E - Error type.
 */
export type FormStore<S, E> = ReturnType<typeof createFormStore<S, E>>;

/**
 * Context to provide the form store.
 */
export const FormContext = createContext<FormStore<any, any> | null>(null);

/**
 * Schema-specific FormProvider component.
 * @param {Omit<FormProviderProps<S>, "createInitialData">} props - Props for the FormProvider.
 * @returns {JSX.Element} A React component that provides the form state context.
 * @example
 * ```
 * const { FormProvider } = createFormProviderAndHooks(myGenerateInitialData, myGetErrorsAtPath);
 * <FormProvider schema={mySchema} initialData={myInitialData}>
 *   <MyFormComponent />
 * </FormProvider>
 * ```
 */
export const FormProvider = <S, E>({
  initialData = {},
  schema,
  children,
  generateInitialData,
}: Omit<FormProviderProps<S>, "createInitialData"> & {
  generateInitialData: (schema: S) => any;
}): JSX.Element => {
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
