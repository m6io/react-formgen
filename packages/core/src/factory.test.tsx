import React, { useContext } from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

import {
  createFormProviderAndHooks,
  createFormStore,
  FormContext,
  TemplatesContext,
  FormProviderProps,
  FormState,
  FormStore,
} from "./factory";
import { useStore, StoreApi } from "zustand";

const testSchema = {
  property1: "string",
  property2: "number",
  nested: { property3: "string" },
};

describe("createFormStore", () => {
  const createInitialData = (schema: typeof testSchema) => {
    void schema;
    return {
      property1: "",
      property2: 0,
      nested: { property3: "" },
    };
  };

  const FormProvider: React.FC<
    Omit<FormProviderProps<typeof testSchema>, "createInitialData">
  > = ({
    initialData = {},
    schema,
    children,
    readonly = false,
    templates = {},
    enableDevtools = false,
  }) => {
    const storeRef = React.useRef<FormStore<typeof testSchema, any> | null>(
      null
    );
    if (!storeRef.current) {
      storeRef.current = createFormStore(
        initialData,
        schema,
        createInitialData,
        readonly,
        enableDevtools
      );
    }

    return (
      <FormContext.Provider value={storeRef.current}>
        <TemplatesContext.Provider value={templates}>
          {children}
        </TemplatesContext.Provider>
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
    const readonly = useStore(
      store as StoreApi<FormState<typeof testSchema, any>>,
      (state) => state.readonly
    );
    const setReadonly = useStore(
      store as StoreApi<FormState<typeof testSchema, any>>,
      (state) => state.setReadonly
    );

    return (
      <div>
        <div data-testid="formData">{JSON.stringify(formData)}</div>
        <div data-testid="readonlyState">{String(readonly)}</div>
        <button
          onClick={() =>
            setFormData(
              ["nested", "nestedLevel1", "nestedLevel2", "property"],
              "newNestedValue"
            )
          }
        >
          Set Deeply Nested Value
        </button>
        <button onClick={() => setReadonly(!readonly)}>
          Toggle Readonly State
        </button>
      </div>
    );
  };

  it("initializes nested object correctly, sets deeply nested value, and respects readonly state", () => {
    render(
      <FormProvider
        schema={testSchema}
        templates={{ Input: InputComponent }}
        readonly={true}
      >
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("formData").textContent).toBe(
      JSON.stringify(createInitialData(testSchema))
    );
    expect(screen.getByTestId("readonlyState").textContent).toBe("true");

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
              property: "newNestedValue",
            },
          },
        },
      })
    );
  });

  // Test setReadonly functionality (Line 62)
  it("toggles readonly state using setReadonly", () => {
    render(
      <FormProvider
        schema={testSchema}
        templates={{ Input: InputComponent }}
        readonly={true}
      >
        <TestComponent />
      </FormProvider>
    );

    // Initial readonly state should be true
    expect(screen.getByTestId("readonlyState").textContent).toBe("true");

    act(() => {
      screen.getByText("Toggle Readonly State").click();
    });

    // Readonly state should now be false
    expect(screen.getByTestId("readonlyState").textContent).toBe("false");

    act(() => {
      screen.getByText("Toggle Readonly State").click();
    });

    // Readonly state should toggle back to true
    expect(screen.getByTestId("readonlyState").textContent).toBe("true");
  });

  it("warns when devtools is enabled in non-production", () => {
    const consoleWarnMock = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    render(
      <FormProvider
        schema={testSchema}
        templates={{ Input: InputComponent }}
        readonly={false}
        enableDevtools={true} // Test for enableDevtools functionality
      >
        <TestComponent />
      </FormProvider>
    );

    expect(consoleWarnMock).toHaveBeenCalledWith(
      expect.stringContaining("Zustand Devtools is enabled")
    );

    consoleWarnMock.mockRestore();
  });
});

// Mock schema and errors for testing purposes
const generateInitialData = (schema: any) => {
  void schema;
  return {
    property1: "",
    property2: 0,
    arrayProperty: [],
  };
};

const getErrorsAtPath = (errors: any[], path: string[]) =>
  errors.filter((error) => error.path === path.join("."));

const InputComponent = () => <input data-testid="inputComponent" />;

// Mock schema and errors for testing purposes
const testSchema2 = {
  property1: "string",
  property2: "number",
  arrayProperty: "array",
};

const testErrors = [{ path: "property1", message: "Error in property1" }];

// Mock zero state function for array items
const generateZeroState = () => ({});

describe("createFormProviderAndHooks", () => {
  const {
    FormProvider,
    Form,
    useFormContext,
    useFormDataAtPath,
    useErrorsAtPath,
    useArrayTemplate,
    useTemplates,
    useRenderTemplate,
  } = createFormProviderAndHooks<typeof testSchema2, (typeof testErrors)[0]>(
    generateInitialData,
    getErrorsAtPath,
    InputComponent
  );

  const TestComponent = ({ initialErrors = null }: { initialErrors?: any }) => {
    const formData = useFormContext(
      (state: FormState<typeof testSchema2, (typeof testErrors)[0]>) =>
        state.formData
    );
    const setErrors = useFormContext(
      (state: FormState<typeof testSchema2, (typeof testErrors)[0]>) =>
        state.setErrors
    );
    const [valueAtPath, setValueAtPath] = useFormDataAtPath(["property1"]);
    const errorsAtPath = useErrorsAtPath(["property1"]);
    const arrayTemplate = useArrayTemplate(
      ["arrayProperty"],
      generateZeroState,
      []
    );

    React.useEffect(() => {
      if (initialErrors) {
        setErrors(initialErrors);
      }
    }, [initialErrors, setErrors]);

    const templates = useTemplates();
    const Input = templates?.["Input"];

    return (
      <div>
        <div data-testid="formData">{JSON.stringify(formData)}</div>
        <div data-testid="valueAtPath">{valueAtPath}</div>
        <div data-testid="errorsAtPath">{JSON.stringify(errorsAtPath)}</div>
        <div data-testid="arrayTemplate">
          {JSON.stringify(arrayTemplate.valueAtPath)}
        </div>
        {Input && <Input />}
        <button onClick={() => setValueAtPath("newValue")}>Set Value</button>
        <button onClick={() => arrayTemplate.addItem()}>Add Item</button>
        <button onClick={() => arrayTemplate.removeItem(0)}>Remove Item</button>
        <button onClick={() => arrayTemplate.moveItem(0, "up")}>Move Up</button>
        <button onClick={() => arrayTemplate.moveItem(0, "down")}>
          Move Down
        </button>
      </div>
    );
  };

  it("provides form context correctly", () => {
    render(
      <FormProvider schema={testSchema2} templates={{ Input: InputComponent }}>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("formData").textContent).toBe(
      JSON.stringify(generateInitialData(testSchema2))
    );
  });

  it("useFormDataAtPath hook works correctly", () => {
    render(
      <FormProvider schema={testSchema2} templates={{ Input: InputComponent }}>
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
      <FormProvider schema={testSchema2} templates={{ Input: InputComponent }}>
        <TestComponent initialErrors={testErrors} />
      </FormProvider>
    );

    // Verify errors
    expect(screen.getByTestId("errorsAtPath").textContent).toBe(
      JSON.stringify(testErrors.filter((e) => e.path === "property1"))
    );
  });

  it("useArrayTemplate hook works correctly", () => {
    render(
      <FormProvider schema={testSchema2} templates={{ Input: InputComponent }}>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("arrayTemplate").textContent).toBe("[]");

    act(() => {
      screen.getByText("Add Item").click();
    });

    expect(screen.getByTestId("arrayTemplate").textContent).toBe(
      JSON.stringify([generateZeroState()])
    );

    act(() => {
      screen.getByText("Add Item").click();
    });

    expect(screen.getByTestId("arrayTemplate").textContent).toBe(
      JSON.stringify([generateZeroState(), generateZeroState()])
    );

    act(() => {
      screen.getByText("Remove Item").click();
    });

    expect(screen.getByTestId("arrayTemplate").textContent).toBe(
      JSON.stringify([generateZeroState()])
    );

    act(() => {
      screen.getByText("Add Item").click();
    });

    expect(screen.getByTestId("arrayTemplate").textContent).toBe(
      JSON.stringify([generateZeroState(), generateZeroState()])
    );

    act(() => {
      screen.getByText("Move Down").click();
    });

    expect(screen.getByTestId("arrayTemplate").textContent).toBe(
      JSON.stringify([generateZeroState(), generateZeroState()])
    );

    act(() => {
      screen.getByText("Move Up").click();
    });

    expect(screen.getByTestId("arrayTemplate").textContent).toBe(
      JSON.stringify([generateZeroState(), generateZeroState()])
    );
  });

  it("throws an error when useFormContext is used outside of FormProvider", () => {
    const TestComponent = () => {
      const formData = useFormContext(
        (state: FormState<typeof testSchema2, any>) => state.formData
      );
      return <div>{JSON.stringify(formData)}</div>;
    };

    expect(() => render(<TestComponent />)).toThrowError(
      "useFormContext must be used within a FormProvider"
    );
  });

  it("throws an error when useTemplates is used outside of FormProvider", () => {
    const TestComponent = () => {
      const templates = useTemplates();
      return <div>{JSON.stringify(templates)}</div>;
    };

    expect(() => render(<TestComponent />)).toThrowError(
      "useTemplates must be used within a FormProvider with templates provided"
    );
  });

  it("throws an error when useRenderTemplate is used outside of FormProvider", () => {
    const TestComponent = () => {
      const RenderTemplate = useRenderTemplate();
      return <RenderTemplate schema={testSchema2} path={["property1"]} />;
    };

    expect(() => render(<TestComponent />)).toThrowError(
      "useRenderTemplate must be used within a FormProvider with renderTemplate provided"
    );
  });

  it("useTemplates hook works correctly", () => {
    render(
      <FormProvider schema={testSchema2} templates={{ Input: InputComponent }}>
        <TestComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("inputComponent")).toBeInTheDocument();
  });

  it("useRenderTemplate hook works correctly", () => {
    const RenderTemplateComponent = () => {
      const RenderTemplate = useRenderTemplate();
      return <RenderTemplate schema={testSchema2} path={["property1"]} />;
    };

    render(
      <FormProvider schema={testSchema2} templates={{ Input: InputComponent }}>
        <RenderTemplateComponent />
      </FormProvider>
    );

    expect(screen.getByTestId("inputComponent")).toBeInTheDocument();
  });

  it("renders fallback UI when base templates missing", () => {
    // Test for missing templates
    render(
      <FormProvider schema={testSchema2}>
        <TestComponent />
      </FormProvider>
    );

    expect(
      screen.getByText("Templates are missing. Please provide base Templates.")
    ).toBeInTheDocument();
  });

  it("renders Form component and tests default onSubmit and onError behavior", () => {
    // Mock console.warn and console.error to test their invocation
    const consoleWarnMock = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const consoleErrorMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <Form
        schema={testSchema2}
        initialData={{}}
        templates={{ Input: InputComponent }}
        formRoot={({ onSubmit, onError }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Simulate errors with correct structure (including 'path' and 'message')
              const errors = [
                { path: "property1", message: "Test error on property1" },
              ];
              onError(errors, {}); // Call onError with simulated errors
              onSubmit({});
            }}
          >
            <button type="submit">Submit</button>
          </form>
        )}
      />
    );

    // Trigger form submission to invoke the default onSubmit and onError functions
    fireEvent.submit(screen.getByRole("button"));

    // Test default onSubmit
    expect(consoleWarnMock).toHaveBeenCalledWith(
      "This is a default `onSubmit` function. You should override this if you want to do something with the form data.",
      {}
    );

    // Test default onError
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "This is a default `onError` function. You should override this if you want to do something with the form errors.",
      [{ path: "property1", message: "Test error on property1" }],
      {}
    );

    // Restore the original console functions
    consoleWarnMock.mockRestore();
    consoleErrorMock.mockRestore();
  });

  it("renders fallback UI when FormRoot, templates, or renderTemplate are missing", () => {
    // Test for missing FormRoot
    render(<Form schema={testSchema2} templates={{}} />);

    expect(
      screen.getByText(
        "FormRoot is missing. Please provide a base FormRoot component."
      )
    ).toBeInTheDocument();

    // Test for missing templates
    render(
      <Form
        schema={testSchema2}
        formRoot={({ onSubmit }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit({});
            }}
          >
            <button type="submit">Submit</button>
          </form>
        )}
      />
    );

    expect(
      screen.getByText("Templates are missing. Please provide base Templates.")
    ).toBeInTheDocument();
  });
});
