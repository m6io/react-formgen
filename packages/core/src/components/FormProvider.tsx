import React, { createContext, useRef } from "react";
import { createStore } from "zustand";

export interface FormState<S, E> {
  schema: S;
  formData: any;
  errors: E[] | null;
  setFormData: (path: string[], value: any) => void;
  setErrors: (errors: E[] | null) => void;
}

export interface FormProviderProps<S> {
  initialData?: any;
  schema: S;
  children: React.ReactNode;
  createInitialData: (schema: S) => any;
}

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

export type FormStore<S, E> = ReturnType<typeof createFormStore<S, E>>;

export const FormContext = createContext<FormStore<any, any> | null>(null);

export const FormProvider = <S,>({
  initialData = {},
  schema,
  children,
  createInitialData,
}: FormProviderProps<S>) => {
  const storeRef = useRef<FormStore<S, any>>();
  if (!storeRef.current) {
    storeRef.current = createFormStore(initialData, schema, createInitialData);
  }

  return (
    <FormContext.Provider value={storeRef.current}>
      {children}
    </FormContext.Provider>
  );
};
