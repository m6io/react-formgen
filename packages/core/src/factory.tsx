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
  generateInitialData: (schema: S) => any,
  getErrorsAtPath: (errors: E[], path: string[]) => E[] | undefined
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

  const useErrorsAtPath = (path: string[]): E[] | undefined => {
    const errors = useFormContext((state) => state.errors);
    return getErrorsAtPath(errors ?? [], path);
  };

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
