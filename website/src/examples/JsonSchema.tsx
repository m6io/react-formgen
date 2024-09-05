import {
  Form,
  FormProvider,
  BaseFormRoot,
  BaseTemplates,
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
      <FormProvider
        schema={jsonSchema}
        initialData={initialFormData}
        templates={BaseTemplates}
      >
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
      <Form
        schema={jsonSchemaWithRecursiveRefs}
        onSubmit={(data) => console.log("JSON Schema:", data)}
        onError={(errors) => console.error("JSON Schema:", errors)}
      />
    </div>
  );
};

export {
  JsonSchemaExample,
  JsonSchemaComplexExample,
  JsonSchemaCustomRenderTemplateExample,
  JsonSchemaWithRecursiveRefsExample,
};
