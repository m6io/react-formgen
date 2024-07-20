import React, { createContext, useRef } from "react";
import { createStore } from "zustand";
import { z } from "zod";
import { generateInitialData } from "../utils";

export interface FormState {
  schema: z.ZodType<any>;
  formData: any;
  errors: z.ZodIssue[] | null;
  setFormData: (path: string[], value: any) => void;
  setErrors: (errors: z.ZodIssue[] | null) => void;
}

export interface FormProviderProps {
  initialData?: any;
  schema: z.ZodType<any>;
  children: React.ReactNode;
}

export const createFormStore = (initialData: any, schema: z.ZodType<any>) => {
  const formData = {
    ...generateInitialData(schema),
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

export type FormStore = ReturnType<typeof createFormStore>;

export const FormContext = createContext<FormStore | null>(null);

export const FormProvider: React.FC<FormProviderProps> = ({
  initialData = {},
  schema,
  children,
}) => {
  const storeRef = useRef<FormStore>();
  if (!storeRef.current) {
    storeRef.current = createFormStore(initialData, schema);
  }

  return (
    <FormContext.Provider value={storeRef.current}>
      {children}
    </FormContext.Provider>
  );
};
