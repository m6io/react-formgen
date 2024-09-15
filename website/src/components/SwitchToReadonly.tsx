import { FormState as JsonSchemaFormState } from "@react-formgen/json-schema";
import { FormState as YupFormState } from "@react-formgen/yup";
import { FormState as ZodFormState } from "@react-formgen/zod";

// Generic hook that returns the readonly state and setter based on the context hook provided
export function useFormReadonly<
  T extends JsonSchemaFormState | YupFormState | ZodFormState,
>(contextHook: <U>(selector: (state: T) => U) => U) {
  const readonly = contextHook((state) => state.readonly);
  const setReadonly = contextHook((state) => state.setReadonly);
  return { readonly, setReadonly };
}

// Generic SwitchToReadonly component that accepts a context hook and uses it to access the form state
export const SwitchToReadonly = <
  T extends JsonSchemaFormState | YupFormState | ZodFormState,
>({
  contextHook,
}: {
  contextHook: <U>(selector: (state: T) => U) => U;
}) => {
  const { readonly, setReadonly } = useFormReadonly(contextHook);

  return (
    <div>
      <label>
        Readonly
        <input
          type="checkbox"
          checked={readonly}
          onChange={(e) => setReadonly(e.target.checked)}
        />
      </label>
    </div>
  );
};
