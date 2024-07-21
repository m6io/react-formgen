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

export const createFormProviderAndHooks = <S, E>(
  generateInitialData: (schema: S) => any
) => {
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

  const useFormContext = <T,>(selector: (state: FormState<S, E>) => T): T => {
    return coreUseFormContext<S, E, T>(selector);
  };

  const useFormDataAtPath = (
    path: string[],
    defaultOnNull: unknown = null
  ): [any, (value: any) => void] => {
    return coreUseFormDataAtPath<S, E>(path, defaultOnNull);
  };

  return { FormProvider, useFormContext, useFormDataAtPath };
};
