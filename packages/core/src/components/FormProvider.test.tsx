import React, { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  createFormStore,
  FormContext,
  FormProviderProps,
  FormState,
  FormStore,
} from "./FormProvider";
import { useStore, StoreApi } from "zustand";

const testSchema = {
  field1: "string",
  field2: "number",
  nested: { field3: "string" },
};

describe("createFormStore", () => {
  const createInitialData = (schema: typeof testSchema) => {
    void schema;
    return {
      field1: "",
      field2: 0,
      nested: { field3: "" },
    };
  };

  const FormProvider: React.FC<
    Omit<FormProviderProps<typeof testSchema>, "createInitialData">
  > = ({ initialData = {}, schema, children }) => {
    const storeRef = React.useRef<FormStore<typeof testSchema, any> | null>(
      null
    );
    if (!storeRef.current) {
      storeRef.current = createFormStore(
        initialData,
        schema,
        createInitialData
      );
    }

    return (
      <FormContext.Provider value={storeRef.current}>
        {children}
      </FormContext.Provider>
    );
  };

  const TestComponent = () => {
    const store = useContext(FormContext);
    if (!store) {
      throw new Error("Store is not available");
    }
    const formData = useStore(
      store as StoreApi<FormState<typeof testSchema, any>>,
      (state) => state.formData
    );
    const setFormData = useStore(
      store as StoreApi<FormState<typeof testSchema, any>>,
      (state) => state.setFormData
    );

    return (
      <div>
        <div data-testid="formData">{JSON.stringify(formData)}</div>
        <button
          onClick={() =>
            setFormData(
              ["nested", "nestedLevel1", "nestedLevel2", "field"],
              "newNestedValue"
            )
          }
        >
          Set Deeply Nested Value
        </button>
      </div>
    );
  };

  it("initializes nested object correctly and sets deeply nested value", () => {
    render(
      <FormProvider schema={testSchema}>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("formData").textContent).toBe(
      JSON.stringify(createInitialData(testSchema))
    );

    act(() => {
      screen.getByText("Set Deeply Nested Value").click();
    });

    expect(screen.getByTestId("formData").textContent).toBe(
      JSON.stringify({
        ...createInitialData(testSchema),
        nested: {
          ...createInitialData(testSchema).nested,
          nestedLevel1: {
            nestedLevel2: {
              field: "newNestedValue",
            },
          },
        },
      })
    );
  });
});
