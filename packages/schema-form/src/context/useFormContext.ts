import { useContext } from "react";
import { useStore } from "zustand";
import { FormState } from "./FormProvider";
import { FormContext } from "./FormProvider";

// Custom hook to access form store
export const useFormContext = <T>(selector: (state: FormState) => T): T => {
  const store = useContext(FormContext);
  if (!store) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return useStore(store, selector);
};
