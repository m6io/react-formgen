import React, { useContext, createContext } from "react";
import { useStore, createStore, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";

/**
 * Represents the state of the form.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 * @param {S} schema - Form schema.
 * @param {any} formData - Form data.
 * @param {E[] | null} errors - Form validation errors.
 * @param {boolean} readonly - Whether the form is readonly.
 * @param {(path: string[], value: any) => void} setFormData - Function to set form data at a specific path.
 * @param {(errors: E[] | null) => void} setErrors - Function to set form validation errors.
 * @param {(readonly: boolean) => void} setReadonly - Function to set the readonly state of the form.
 * @returns {FormState<S, E>} The state of the form.
 */
export interface FormState<S, E> {
  schema: S;
  formData: any;
  errors: E[] | null;
  readonly: boolean;
  setFormData: (path: string[], value: any) => void;
  setErrors: (errors: E[] | null) => void;
  setReadonly: (readonly: boolean) => void;
}

/**
 * Props for the FormProvider component.
 *
 * @template S - The schema type used to define the structure of the form.
 * @param {any} initialData - Initial form data.
 * @param {S} schema - Form schema.
 * @param {(schema: S) => any} createInitialData - Function to create initial data from the schema.
 * @param {boolean} readonly - Initial readonly state.
 * @param {React.ReactNode} children - Child components to be rendered within the FormProvider.
 * @param {{ [key: string]: React.ComponentType<any> }} templates - Templates to be used in the form.
 * @param {React.ComponentType<RenderTemplateProps<S>>} renderTemplate - Render template component to be used in the form.
 * @param {boolean} enableDevtools - Flag to enable or disable Zustand DevTools middleware.
 * @returns {JSX.Element} A React component that provides the form state context and templates context.
 */
export interface FormProviderProps<S> {
  initialData?: any;
  schema: S;
  children: React.ReactNode;
  createInitialData: (schema: S) => any;
  templates?: { [key: string]: React.ComponentType<any> };
  readonly?: boolean;
  renderTemplate?: React.ComponentType<RenderTemplateProps<S>>;
  enableDevtools?: boolean;
}

/**
 * Props for the render template component.
 *
 * @template S - The schema type used to define the structure of the form.
 * @param {S} schema - Form schema.
 * @param {string[]} path - Path to the form data.
 * @returns {JSX.Element} A React component that renders the form template.
 */
export interface RenderTemplateProps<S> {
  schema: S;
  path: string[];
}

/**
 * Creates a store for the form state. This is used internally to initialize and manage the form's state using Zustand.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 * @param {any} initialData - Initial form data.
 * @param {S} schema - Form schema.
 * @param {(schema: S) => any} createInitialData - Function to create initial data from the schema.
 * @param {boolean} readonly - Initial readonly state.
 * @param {boolean} enableDevtools - Flag to enable or disable Zustand DevTools middleware.
 * @returns {ReturnType<typeof createStore<FormState<S, E>>>} A Zustand store for the form state.
 */
export const createFormStore = <S, E>(
  initialData: any,
  schema: S,
  createInitialData: (schema: S) => any,
  readonly?: boolean,
  enableDevtools: boolean = false
) => {
  const formData = {
    ...createInitialData(schema),
    ...initialData,
  };

  const stateCreator: StateCreator<FormState<S, E>> = (set) => ({
    schema: schema,
    formData: formData,
    errors: null,
    readonly: readonly || false,
    setFormData: (path, value) =>
      set((state) => {
        const target = { ...state.formData };
        let current = target;

        path.slice(0, -1).forEach((key) => {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        });

        current[path[path.length - 1]] = value;

        return { formData: target };
      }),
    setErrors: (errors) => set({ errors }),
    setReadonly: (readonly) => set({ readonly }),
  });

  // Conditionally apply devtools based on the flag
  if (enableDevtools) {
    // Generate a unique name for the store
    const FormStoreName = `FormStore_${nanoid()}`;

    console.warn(
      `WARNING: Zustand Devtools is enabled for FormStore: ${FormStoreName}. This should be disabled in production.`
    );

    // Wrap the state creator with devtools and assign the unique store name.
    return createStore(
      devtools(stateCreator, { name: FormStoreName, enabled: enableDevtools })
    );
  }

  // Return the store without devtools if the flag is false
  return createStore(stateCreator);
};

/**
 * Type representing the store for the form state. Used internally to define the form state management structure.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 * @returns {ReturnType<typeof createFormStore<S, E>>} A Zustand store for the form state.
 */
export type FormStore<S, E> = ReturnType<typeof createFormStore<S, E>>;

/**
 * Context to provide the form store. Used internally to make the form state accessible throughout the component tree.
 * @returns {React.Context<FormStore<any, any> | null>} A React context that provides the form store.
 */
export const FormContext = createContext<FormStore<any, any> | null>(null);

/**
 * Context to provide the templates. Used to make templates accessible throughout the component tree.
 * @returns {React.Context<{ [key: string]: React.ComponentType<any> } | null>} A React context that provides the templates.
 */
export const TemplatesContext = createContext<{
  [key: string]: React.ComponentType<any>;
} | null>(null);

/**
 * Context to provide the render template component. Used to make the render template component accessible throughout the component tree.
 * @returns {React.Context<React.ComponentType<RenderTemplateProps<any>> | null>} A React context that provides the render template component.
 */
export const RenderTemplateContext = createContext<React.ComponentType<
  RenderTemplateProps<any>
> | null>(null);

/**
 * Generalized type for form props.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The error type used for form validation errors.
 * @param {S} schema - Form schema.
 * @param {any} initialData - Initial form data.
 * @param {(data: { [key: string]: unknown }) => void} onSubmit - Function to handle form submission.
 * @param {(errors: E[], data?: { [key: string]: unknown }) => void} onError - Function to handle form errors.
 * @param {{ [key: string]: React.ComponentType<any> }} templates - Templates to be used in the form.
 * @param {React.FC<FormRootProps<E>>} formRoot - The root component responsible for rendering the form and handling form submission and errors.
 * @param {boolean} readonly - Whether the form is readonly.
 * @param {React.ComponentType<RenderTemplateProps<S>>} renderTemplate - Render template component to be used in the form.
 * @param {boolean} enableDevtools - Flag to enable or disable Zustand DevTools middleware.
 * @returns {JSX.Element} A React component that provides the form state context and templates context.
 */
export type FormProps<S, E> = {
  schema: S;
  initialData?: { [key: string]: unknown };
  onSubmit?: (data: { [key: string]: unknown }) => void;
  onError?: (errors: E[], data?: { [key: string]: unknown }) => void;
  templates?: { [key: string]: React.ComponentType<any> };
  formRoot?: React.FC<FormRootProps<E>>;
  readonly?: boolean;
  renderTemplate?: React.ComponentType<RenderTemplateProps<S>>;
  enableDevtools?: boolean;
};

/**
 * Generalized type for form root props.
 *
 * @template E - The error type.
 * @param {(data: { [key: string]: unknown }) => void} onSubmit - Function to handle form submission.
 * @param {(errors: E[], data?: { [key: string]: unknown }) => void} onError - Function to handle form errors.
 * @returns {Object} An object containing schema-specific FormProvider, useFormContext, useFormDataAtPath, useErrorsAtPath, useArrayTemplate, useTemplates hooks, and a generalized Form component.
 */
export type FormRootProps<E> = {
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: E[], data?: { [key: string]: unknown }) => void;
};

/**
 * Factory function to create schema-specific form provider and hooks.
 *
 * @template S - The schema type used to define the structure of the form.
 * @template E - The type used for form validation errors.
 * @param {(schema: S) => any} generateInitialData - Function to generate initial data from the schema.
 * @param {(errors: E[], path: string[]) => E[] | undefined} getErrorsAtPath - Function to get errors at a specific path.
 * @param {React.ComponentType<RenderTemplateProps<S>>} BaseRenderTemplate - The base render template component to be used in the form.
 * @param {React.FC<FormRootProps<E>>} [BaseFormRoot] - The root component responsible for rendering the form and handling form submission and errors. This is optional in case implementations do not want to use the Form component.
 * @param {{ [key: string]: React.ComponentType<any> }} [BaseTemplates] - The base templates to be used in the form. This is optional in case implementations do not want to use the Form component.
 * @returns {Object} An object containing schema-specific FormProvider, useFormContext, useFormDataAtPath, useErrorsAtPath, useArrayTemplate, useTemplates hooks, and a generalized Form component.
 * @example
 * ```
 * const { FormProvider, useFormContext, useFormDataAtPath, useErrorsAtPath, useArrayTemplate, useTemplates, useRenderTemplate, Form } = createFormProviderAndHooks<SchemaType, ErrorType>(generateInitialData, getErrorsAtPath, DefaultRenderTemplate, BaseFormRoot, BaseTemplates);
 * ```
 */
export const createFormProviderAndHooks = <S, E>(
  generateInitialData: (schema: S) => any,
  getErrorsAtPath: (errors: E[], path: string[]) => E[] | undefined,
  BaseRenderTemplate: React.ComponentType<RenderTemplateProps<S>>,
  BaseFormRoot?: React.FC<FormRootProps<E>>,
  BaseTemplates?: { [key: string]: React.ComponentType<any> }
) => {
  /**
   * Schema-specific FormProvider component.
   *
   * @param {Omit<FormProviderProps<S>, "createInitialData">} props - Props for the FormProvider component, excluding the createInitialData prop.
   * @returns {JSX.Element} A React component that provides the form state context and templates context.
   * @example
   * ```
   * const { FormProvider } = createFormProviderAndHooks<SchemaType, ErrorType>(generateInitialData, getErrorsAtPath, DefaultRenderTemplate, BaseFormRoot, BaseTemplates);
   * // Using base components and built-in render template
   * <FormProvider schema={mySchema} initialData={myInitialData}>
   *   <MyFormComponent />
   * </FormProvider>
   *
   * // Using custom components and render template
   * <FormProvider schema={mySchema} initialData={myInitialData} templates={myTemplates} renderTemplate={MyRenderTemplate}>
   *  <MyFormComponent />
   * </FormProvider>
   * ```
   */
  const FormProvider: React.FC<
    Omit<FormProviderProps<S>, "createInitialData">
  > = ({
    initialData = {},
    schema,
    children,
    templates = BaseTemplates,
    readonly = false,
    renderTemplate = BaseRenderTemplate,
    enableDevtools = false,
  }) => {
    const storeRef = React.useRef<FormStore<S, E>>();
    if (!storeRef.current) {
      storeRef.current = createFormStore<S, E>(
        initialData,
        schema,
        generateInitialData,
        readonly,
        enableDevtools
      );
    }

    if (!templates) {
      console.error("Templates are missing. Please provide base Templates.");
      return <div>Templates are missing. Please provide base Templates.</div>;
    }

    return (
      <FormContext.Provider value={storeRef.current}>
        <TemplatesContext.Provider value={templates}>
          <RenderTemplateContext.Provider value={renderTemplate}>
            {children}
          </RenderTemplateContext.Provider>
        </TemplatesContext.Provider>
      </FormContext.Provider>
    );
  };

  /**
   * Custom hook to access the form state from the context.
   *
   * @template T - The type of the selected part of the form state.
   * @param {(state: FormState<S, E>) => T} selector - Selector function to pick a part of the form state.
   * @returns {T} The selected part of the form state.
   * @example
   * ```
   * const formData = useFormContext(state => state.formData);
   * ```
   */
  const useFormContext = <T,>(selector: (state: FormState<S, E>) => T): T => {
    const store = useContext(FormContext);
    if (!store) {
      console.error(
        "FormContext is missing. Ensure you are within a FormProvider."
      );
      throw new Error("useFormContext must be used within a FormProvider");
    }
    return useStore(store, selector);
  };

  /**
   * Custom hook to get and set form data at a specific path in the form state.
   *
   * @param {string[]} path - Path to the form data.
   * @param {unknown} defaultOnNull - Default value if the data at the path is null.
   * @returns {[any, (value: any) => void]} A tuple containing the data at the path and a function to set the data at the path.
   * @example
   * ```
   * const [value, setValue] = useFormDataAtPath(["property1", "property2"]);
   * ```
   */
  const useFormDataAtPath = (
    path: string[],
    defaultOnNull: unknown = null
  ): [any, (value: any) => void] => {
    const formData = useFormContext((state: FormState<S, E>) => state.formData);
    const setFormData = useFormContext(
      (state: FormState<S, E>) => state.setFormData
    );
    const valueAtPath =
      path.reduce((acc, key) => acc?.[key], formData) ?? defaultOnNull;

    const setValueAtPath = (value: any) => setFormData(path, value);

    return [valueAtPath, setValueAtPath];
  };

  /**
   * Custom hook to retrieve validation errors at a specific path in the form state.
   *
   * @param {string[]} path - Path to the errors in the form state.
   * @returns {E[] | undefined} The errors at the specified path, if any.
   * @example
   * ```
   * const errors = useErrorsAtPath(["property1", "property2"]);
   * ```
   */
  const useErrorsAtPath = (path: string[]): E[] | undefined => {
    const errors = useFormContext((state: FormState<S, E>) => state.errors);
    return getErrorsAtPath(errors ?? [], path);
  };

  /**
   * Custom hook to manage array properties within the form state.
   *
   * @param {string[]} path - Path to the array data in the form state.
   * @param {() => any} zeroState - Function to get the initial state for a new array item.
   * @param {any} defaultOnNull - Default value if the data at the path is null.
   * @returns {Object} An object containing the array data, errors at the path, and functions to manipulate the array.
   * @example
   * ```
   * const { valueAtPath, addItem, removeItem, moveItem } = useArrayTemplate(["arrayProperty"], () => ({}));
   * ```
   */
  const useArrayTemplate = (
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

  /**
   * Custom hook to access the templates from the context.
   *
   * @returns {{ [key: string]: React.ComponentType<any> }} The templates available in the form context.
   * @example
   * ```
   * const templates = useTemplates();
   * const MyInput = templates["Input"];
   * ```
   */
  const useTemplates = () => {
    const templates = useContext(TemplatesContext);
    if (!templates) {
      console.error(
        "TemplatesContext is missing. Ensure you are within a FormProvider with templates provided."
      );
      throw new Error(
        "useTemplates must be used within a FormProvider with templates provided"
      );
    }
    return templates;
  };

  /**
   * Custom hook to access the render template component from the context.
   *
   * @returns {React.ComponentType<RenderTemplateProps<S>>} The render template component available in the form context.
   * @example
   * ```
   * const RenderTemplate = useRenderTemplate();
   * ```
   */
  const useRenderTemplate = (): React.ComponentType<RenderTemplateProps<S>> => {
    const renderTemplate = useContext(RenderTemplateContext);
    if (!renderTemplate) {
      console.error(
        "RenderTemplateContext is missing. Ensure you are within a FormProvider with renderTemplate provided."
      );
      throw new Error(
        "useRenderTemplate must be used within a FormProvider with renderTemplate provided"
      );
    }
    return renderTemplate;
  };

  /**
   * Generalized Form component to render a form using the provided schema.
   *
   * @template S - The schema type used to define the structure of the form.
   * @template E - The error type used for form validation errors.
   * @param {FormProps<S, E>} props - Props for the Form component.
   * @returns {JSX.Element} A React component that renders a form using the provided schema.
   * @example
   * ```
   * const { Form } = createFormProviderAndHooks<SchemaType, ErrorType>(generateInitialData, getErrorsAtPath, DefaultRenderTemplate, BaseFormRoot, BaseTemplates);
   *
   * // Using base components and built-in render template
   * <Form schema={mySchema} initialData={myInitialData} onSubmit={handleSubmit} onError={handleSubmit} />
   *
   * // Using custom components and render template
   * <Form schema={mySchema} initialData={myInitialData} onSubmit={handleSubmit} onError={handleSubmit} templates={myTemplates} formRoot={MyFormRoot} renderTemplate={MyRenderTemplate} />
   * ```
   */
  const Form: React.FC<FormProps<S, E>> = ({
    schema,
    initialData = {},
    onSubmit = (data) =>
      console.warn(
        "This is a default `onSubmit` function. You should override this if you want to do something with the form data.",
        data
      ),
    onError = (errors, data) =>
      console.error(
        "This is a default `onError` function. You should override this if you want to do something with the form errors.",
        errors,
        data
      ),
    templates = BaseTemplates,
    formRoot: FormRoot = BaseFormRoot,
    readonly = false,
    renderTemplate = BaseRenderTemplate,
    enableDevtools = false,
  }) => {
    if (!FormRoot) {
      console.error(
        "FormRoot is missing. Please provide a base FormRoot component."
      );
      return (
        <div>
          FormRoot is missing. Please provide a base FormRoot component.
        </div>
      );
    }

    if (!templates) {
      console.error("Templates are missing. Please provide base Templates.");
      return <div>Templates are missing. Please provide base Templates.</div>;
    }

    if (!renderTemplate) {
      console.error(
        "RenderTemplate component is missing. Please provide a base RenderTemplate."
      );
      return (
        <div>
          RenderTemplate component is missing. Please provide a base
          RenderTemplate.
        </div>
      );
    }

    return (
      <FormProvider
        schema={schema}
        initialData={initialData}
        templates={templates}
        readonly={readonly}
        renderTemplate={renderTemplate}
        enableDevtools={enableDevtools}
      >
        <FormRoot onSubmit={onSubmit} onError={onError} />
      </FormProvider>
    );
  };

  return {
    FormProvider,
    useFormContext,
    useFormDataAtPath,
    useErrorsAtPath,
    useArrayTemplate,
    useTemplates,
    useRenderTemplate,
    Form,
  };
};
