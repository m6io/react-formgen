import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createFormProviderAndHooks } from "../src/factory";
import { FormState } from "../src/components/FormProvider";

const generateInitialData = (schema: any) => {
  void schema;
  return {
    field1: "",
    field2: 0,
    arrayField: [],
  };
};
const getErrorsAtPath = (errors: any[], path: string[]) =>
  errors.filter((error) => error.path === path.join("."));

// Mock schema and errors for testing purposes
const testSchema = { field1: "string", field2: "number", arrayField: "array" };
const testErrors = [{ path: "field1", message: "Error in field1" }];

// Mock zero state function for array items
const generateZeroState = () => ({});

describe("createFormProviderAndHooks", () => {
  const {
    FormProvider,
    useFormContext,
    useFormDataAtPath,
    useErrorsAtPath,
    useArrayFieldset,
  } = createFormProviderAndHooks<typeof testSchema, (typeof testErrors)[0]>(
    generateInitialData,
    getErrorsAtPath
  );

  const TestComponent = ({ initialErrors = null }: { initialErrors?: any }) => {
    const formData = useFormContext(
      (state: FormState<typeof testSchema, (typeof testErrors)[0]>) =>
        state.formData
    );
    const setErrors = useFormContext(
      (state: FormState<typeof testSchema, (typeof testErrors)[0]>) =>
        state.setErrors
    );
    const [valueAtPath, setValueAtPath] = useFormDataAtPath(["field1"]);
    const errorsAtPath = useErrorsAtPath(["field1"]);
    const arrayFieldset = useArrayFieldset(
      ["arrayField"],
      generateZeroState,
      []
    );

    React.useEffect(() => {
      if (initialErrors) {
        setErrors(initialErrors);
      }
    }, [initialErrors, setErrors]);

    return (
      <div>
        <div data-testid="formData">{JSON.stringify(formData)}</div>
        <div data-testid="valueAtPath">{valueAtPath}</div>
        <div data-testid="errorsAtPath">{JSON.stringify(errorsAtPath)}</div>
        <div data-testid="arrayFieldset">
          {JSON.stringify(arrayFieldset.valueAtPath)}
        </div>
        <button onClick={() => setValueAtPath("newValue")}>Set Value</button>
        <button onClick={() => arrayFieldset.addItem()}>Add Item</button>
        <button onClick={() => arrayFieldset.removeItem(0)}>Remove Item</button>
        <button onClick={() => arrayFieldset.moveItem(0, "up")}>Move Up</button>
        <button onClick={() => arrayFieldset.moveItem(0, "down")}>
          Move Down
        </button>
      </div>
    );
  };

  it("provides form context correctly", () => {
    render(
      <FormProvider schema={testSchema}>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("formData").textContent).toBe(
      JSON.stringify(generateInitialData(testSchema))
    );
  });

  it("useFormDataAtPath hook works correctly", () => {
    render(
      <FormProvider schema={testSchema}>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("valueAtPath").textContent).toBe("");

    act(() => {
      screen.getByText("Set Value").click();
    });

    expect(screen.getByTestId("valueAtPath").textContent).toBe("newValue");
  });

  it("useErrorsAtPath hook works correctly", () => {
    render(
      <FormProvider schema={testSchema}>
        <TestComponent initialErrors={testErrors} />
      </FormProvider>
    );

    // Verify errors
    expect(screen.getByTestId("errorsAtPath").textContent).toBe(
      JSON.stringify(testErrors.filter((e) => e.path === "field1"))
    );
  });

  it("useArrayFieldset hook works correctly", () => {
    render(
      <FormProvider schema={testSchema}>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("arrayFieldset").textContent).toBe("[]");

    act(() => {
      screen.getByText("Add Item").click();
    });

    expect(screen.getByTestId("arrayFieldset").textContent).toBe(
      JSON.stringify([generateZeroState()])
    );

    act(() => {
      screen.getByText("Add Item").click();
    });

    expect(screen.getByTestId("arrayFieldset").textContent).toBe(
      JSON.stringify([generateZeroState(), generateZeroState()])
    );

    act(() => {
      screen.getByText("Remove Item").click();
    });

    expect(screen.getByTestId("arrayFieldset").textContent).toBe(
      JSON.stringify([generateZeroState()])
    );

    act(() => {
      screen.getByText("Add Item").click();
    });

    expect(screen.getByTestId("arrayFieldset").textContent).toBe(
      JSON.stringify([generateZeroState(), generateZeroState()])
    );

    act(() => {
      screen.getByText("Move Down").click();
    });

    expect(screen.getByTestId("arrayFieldset").textContent).toBe(
      JSON.stringify([generateZeroState(), generateZeroState()])
    );

    act(() => {
      screen.getByText("Move Up").click();
    });

    expect(screen.getByTestId("arrayFieldset").textContent).toBe(
      JSON.stringify([generateZeroState(), generateZeroState()])
    );
  });

  it("throws an error when useFormContext is used outside of FormProvider", () => {
    const TestComponent = () => {
      const formData = useFormContext(
        (state: FormState<typeof testSchema, any>) => state.formData
      );
      return <div>{JSON.stringify(formData)}</div>;
    };

    expect(() => render(<TestComponent />)).toThrowError(
      "useFormContext must be used within a FormProvider"
    );
  });
});
