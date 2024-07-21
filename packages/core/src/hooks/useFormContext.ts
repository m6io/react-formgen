import { useContext } from "react";
import { useStore } from "zustand";
import { FormContext, FormState } from "../components/FormProvider";

export const useFormContext = <S, E, T>(
  selector: (state: FormState<S, E>) => T
): T => {
  const store = useContext(FormContext);
  if (!store) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return useStore(store, selector);
};
