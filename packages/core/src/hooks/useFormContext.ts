import { useContext } from "react";
import { useStore } from "zustand";
import { FormContext, FormState } from "../components/FormProvider";

/**
 * Hook to access the form context.
 * @template S - Schema type.
 * @template E - Error type.
 * @template T - Return type of the selector function.
 * @param {(state: FormState<S, E>) => T} selector - Selector function to select a part of the form state.
 * @returns {T} The selected part of the form state.
 * @throws {Error} If the hook is used outside of a FormProvider.
 * @example
 * ```
 * const formData = useFormContext(state => state.formData);
 * ```
 */
export const useFormContext = <S, E, T>(
  selector: (state: FormState<S, E>) => T
): T => {
  const store = useContext(FormContext);
  if (!store) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return useStore(store, selector);
};
