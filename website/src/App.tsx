import { z } from "zod";
import {
  Form as JsonSchemaForm,
  FormProvider as JsonSchemaFormProvider,
  BaseFormTemplate as JsonSchemaBaseFormTemplate,
  BaseDisplayTemplate as JsonSchemaBaseDisplayTemplate,
  BaseFieldTemplates as JsonSchemaBaseFieldTemplates,
  FormgenJSONSchema7,
} from "@react-formgen/json-schema";

import {
  Form as ZodForm,
  FormProvider as ZodFormProvider,
  BaseFormTemplate as ZodBaseFormTemplate,
  BaseDisplayTemplate as ZodBaseDisplayTemplate,
  BaseFieldTemplates as ZodBaseFieldTemplates,
} from "@react-formgen/zod";

import { jsonSchema } from "./schemas/jsonSchema.ts";
import { zodSchema } from "./schemas/zodSchema.ts";

export const jsonSchemaBasic: FormgenJSONSchema7 = {
  title: "User Form",
  description: "A simple user form",
  type: "object",
  properties: {
    firstName: { type: "string", title: "First Name" },
    lastName: { type: "string", title: "Last Name" },
    age: { type: "integer", title: "Age" },
    email: { type: "string", format: "email", title: "Email Address" },
  },
  required: ["firstName", "lastName", "email"],
};

export const zodSchemaBasic = z.object({
  firstName: z
    .string()
    .regex(new RegExp("^[A-Za-z]+$"))
    .min(1)
    .max(100)
    .describe("The person's first name."),
  lastName: z
    .string()
    .regex(new RegExp("^[A-Za-z]+$"))
    .min(1)
    .max(100)
    .describe("The person's last name."),
  age: z
    .number()
    .int()
    .gte(0)
    .lte(150)
    .describe("The person's age.")
    .optional(),
  email: z.string().email().describe("The person's email address."),
});

const initialFormData = {
  firstName: "John Doe",
  lastName: "Doe John",
  age: 69,
  email: "johndoe@joedohn.com",
};

const formWrapperStyle = {
  flex: 1,
  padding: "1rem",
  margin: "1rem",
  border: "1px solid black",
  borderRadius: "1rem",
};

const App = () => {
  return (
    <div>
      <h1>Form Comparison</h1>
      <hr />
      <h3>Simple Forms</h3>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={formWrapperStyle}>
          <h2>JSON Schema Form</h2>
          <JsonSchemaForm
            schema={jsonSchemaBasic}
            initialData={initialFormData}
            fieldTemplates={JsonSchemaBaseFieldTemplates}
            formTemplate={JsonSchemaBaseFormTemplate}
            onSubmit={(data) => console.log("JSON Schema:", data)}
            onError={(errors) => console.error("JSON Schema:", errors)}
          ></JsonSchemaForm>
        </div>
        <div style={formWrapperStyle}>
          <h2>Zod Schema Form</h2>

          <ZodForm
            schema={zodSchemaBasic}
            initialData={initialFormData}
            fieldTemplates={ZodBaseFieldTemplates}
            formTemplate={ZodBaseFormTemplate}
            onSubmit={(data) => console.log("Zod:", data)}
            onError={(errors) => console.error("Zod:", errors)}
          ></ZodForm>
        </div>
      </div>

      <h3>Complex Forms</h3>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={formWrapperStyle}>
          <h2>JSON Schema Form</h2>
          <JsonSchemaFormProvider
            schema={jsonSchema}
            initialData={initialFormData}
          >
            <JsonSchemaBaseFormTemplate
              fieldTemplates={JsonSchemaBaseFieldTemplates}
              onSubmit={(data) => console.log("JSON Schema:", data)}
              onError={(errors) => console.error("JSON Schema:", errors)}
            />
            <JsonSchemaBaseDisplayTemplate
              fieldTemplates={JsonSchemaBaseFieldTemplates}
            />
          </JsonSchemaFormProvider>
        </div>

        <div style={formWrapperStyle}>
          <h2>Zod Schema Form</h2>

          <ZodFormProvider schema={zodSchema} initialData={initialFormData}>
            <ZodBaseFormTemplate
              fieldTemplates={ZodBaseFieldTemplates}
              onSubmit={(data) => console.log("Zod:", data)}
              onError={(errors) => console.error("Zod:", errors)}
            />
            <ZodBaseDisplayTemplate fieldTemplates={ZodBaseFieldTemplates} />
          </ZodFormProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
