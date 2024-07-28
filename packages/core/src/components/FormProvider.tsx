import React, { createContext } from "react";
import { createStore } from "zustand";

/**
 * Represents the state of the form.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
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
 *
 * @template S - The schema type used to define the structure of the form.
 */
export interface FormProviderProps<S> {
  initialData?: any;
  schema: S;
  children: React.ReactNode;
  createInitialData: (schema: S) => any;
}

/**
 * Creates a store for the form state. This is used internally to initialize and manage the form's state using Zustand.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 * @param {any} initialData - Initial form data.
 * @param {S} schema - Form schema.
 * @param {(schema: S) => any} createInitialData - Function to create initial data from the schema.
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
 * Type representing the store for the form state. Used internally to define the form state management structure.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 */
export type FormStore<S, E> = ReturnType<typeof createFormStore<S, E>>;

/**
 * Context to provide the form store. Used internally to make the form state accessible throughout the component tree.
 */
export const FormContext = createContext<FormStore<any, any> | null>(null);
