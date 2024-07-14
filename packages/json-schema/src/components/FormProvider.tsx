import React, { createContext, useRef } from "react";
import { createStore } from "zustand";
import { JSONSchema7 } from "json-schema";
import { ErrorObject } from "ajv";
import { generateInitialData } from "@/utils/generateInitialData";

// Zustand store for form data and errors.
export interface FormState {
  schema: JSONSchema7;
  formData: any;
  errors: ErrorObject[] | null;
  setFormData: (path: string[], value: any) => void;
  setErrors: (errors: ErrorObject[] | null) => void;
}

// Form Provider Props
export interface FormProviderProps {
  initialData?: any;
  schema: JSONSchema7;
  children: React.ReactNode;
}

// Form Store Factory
export const createFormStore = (
  initialData: any,
  schema: JSONSchema7,
  definitions: any
) => {
  const formData = {
    ...generateInitialData(schema, definitions),
    ...initialData,
  };

  return createStore<FormState>((set) => ({
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

// Form Store Type
export type FormStore = ReturnType<typeof createFormStore>;

// Form Context
export const FormContext = createContext<FormStore | null>(null);

// Form Provider Component
export const FormProvider: React.FC<FormProviderProps> = ({
  initialData = {},
  schema,
  children,
}) => {
  const storeRef = useRef<FormStore>();
  if (!storeRef.current) {
    storeRef.current = createFormStore(
      initialData,
      schema,
      schema.definitions || {}
    );
  }

  return (
    <FormContext.Provider value={storeRef.current}>
      {children}
    </FormContext.Provider>
  );
};
