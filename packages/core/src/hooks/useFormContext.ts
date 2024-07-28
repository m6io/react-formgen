import { useContext } from "react";
import { useStore } from "zustand";
import { FormContext, FormState } from "../components/FormProvider";

/**
 * Custom hook to access the form state from the context.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 * @template T - The type of the selected part of the form state.
 * @param {(state: FormState<S, E>) => T} selector - Selector function to pick a part of the form state.
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
