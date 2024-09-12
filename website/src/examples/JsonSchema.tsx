import {
  Form,
  FormProvider,
  BaseFormRoot,
  useFormContext,
} from "@react-formgen/json-schema";
import {
  jsonSchema,
  jsonSchemaBasic,
  jsonSchemaWithRecursiveRefs,
} from "../schemas/jsonSchema";
import { RenderTemplate } from "../components/templates/json-schema/RenderTemplate.tsx";
import { SwitchToReadonly } from "../components/SwitchToReadonly.tsx";

const initialFormData = {
  firstName: "John Doe",
  lastName: "Doe John",
  age: 69,
  email: "johndoe@joedohn.com",
};

// This example demonstrates how to use the `Form` component
// to render a form based on a JSON schema. The `Form` component
const JsonSchemaExample = () => {
  return (
    <div>
      <h2>JSON Schema Form</h2>

      <p>
        This form demonstrates a basic JSON schema form with a simple schema and
        initial data. The form will validate the data based on the schema and
        display errors if the data is invalid.
      </p>
      <Form
        schema={jsonSchemaBasic}
        initialData={initialFormData}
        onSubmit={(data) => console.log("JSON Schema:", data)}
        onError={(errors) => console.error("JSON Schema:", errors)}
      />

      <h2>JSON Schema Form (Readonly)</h2>
      <Form schema={jsonSchemaBasic} initialData={initialFormData} readonly />
    </div>
  );
};

// This example demonstrates a more advanced use case
// where the `FormProvider` is used instead of the `Form`
// component in order to use custom components that
// require access to the form's context. In this case,
// the `SwitchToReadonly` component is used to toggle
// the form between editable and readonly states.
const JsonSchemaComplexExample = () => {
  return (
    <div>
      <h2>Complex JSON Schema Form</h2>

      <p>
        This form demonstrates a more complex JSON schema form with a custom
        form provider and initial data. The form will validate the data based on
        the schema and display errors if the data is invalid.
      </p>
      <FormProvider schema={jsonSchema} initialData={initialFormData}>
        <SwitchToReadonly contextHook={useFormContext} />
        <BaseFormRoot
          onSubmit={(data) => console.log("JSON Schema:", data)}
          onError={(errors) => console.error("JSON Schema:", errors)}
        />
      </FormProvider>
    </div>
  );
};

// This example demonstrates how to use a
// custom render template with the `Form` component,
// which allows you to customize the recursive
// rendering rules of the form.
const JsonSchemaCustomRenderTemplateExample = () => {
  return (
    <div>
      <h2>Custom Render Template JSON Schema Form</h2>

      <p>
        This form demonstrates a custom template renderer that works differently
        than the default template renderer. In this case, the custom renderer
        does not render objects recursively, but instead requires the user to
        manually resolve the nested schemas.
      </p>
      <Form
        schema={jsonSchema}
        initialData={initialFormData}
        renderTemplate={RenderTemplate}
        onSubmit={(data) => console.log("JSON Schema:", data)}
        onError={(errors) => console.error("JSON Schema:", errors)}
      ></Form>

      <h2>JSON Schema Form (Readonly)</h2>
      <Form
        schema={jsonSchema}
        initialData={initialFormData}
        renderTemplate={RenderTemplate}
        readonly
      ></Form>
    </div>
  );
};

// This example demonstrates the use of a JSON schema
// with recursive references, which are not currently
// supported by the form generator. The form will
// render with unresolvable fields.
const JsonSchemaWithRecursiveRefsExample = () => {
  return (
    <div>
      <h2>JSON Schema Unresolvable Form</h2>

      <p>
        This form demonstrates a JSON schema with recursive references, which
        are not currently supported by the form generator. The form will render
        with unresolvable fields.
      </p>
      <Form
        schema={jsonSchemaWithRecursiveRefs}
        onSubmit={(data) => console.log("JSON Schema:", data)}
        onError={(errors) => console.error("JSON Schema:", errors)}
      />
    </div>
  );
};

// This example demonstrates how to enable the Zustand DevTools (using Redux DevTools)
// for the form state, which allows you to inspect and manipulate
// the form state in real-time.

// Note: To access the DevTools, open the browser's developer
// tools and navigate to the Redux DevTools tab.

// Warning: Enabling the DevTools sets the internal Zustand store's
// state to be exposed to the browser's DevTools. This should only be used
// in development mode or non-sensitive environments, as it may expose
// application state and user data. Avoid enabling it in production
// environments where sensitive information is handled.
const JsonSchemaWithDevToolsExample = () => {
  // Enable the DevTools only in development mode
  // const enableDevtools = process.env.NODE_ENV === "development";

  // Enable the DevTools in all environments (just for demonstration purposes)
  const enableDevtools = true;

  return (
    <div>
      <h2>JSON Schema Form with DevTools</h2>

      <p>
        The Zustand DevTools are enabled for this form. Open the browser's
        developer tools and navigate to the Redux DevTools tab to inspect and
        manipulate the form state.
      </p>
      <Form
        schema={jsonSchemaBasic}
        initialData={initialFormData}
        onSubmit={(data) => console.log("JSON Schema:", data)}
        onError={(errors) => console.error("JSON Schema:", errors)}
        enableDevtools={enableDevtools}
      />
    </div>
  );
};

export {
  JsonSchemaExample,
  JsonSchemaComplexExample,
  JsonSchemaCustomRenderTemplateExample,
  JsonSchemaWithRecursiveRefsExample,
  JsonSchemaWithDevToolsExample,
};
