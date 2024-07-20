import { useContext } from "react";
import { useStore } from "zustand";
import { FormContext, FormState } from "../components/FormProvider";

// Custom hook to access form store
export const useFormContext = <T>(selector: (state: FormState) => T): T => {
  const store = useContext(FormContext);
  if (!store) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return useStore(store, selector);
};
