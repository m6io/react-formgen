import * as Yup from "yup";
import { z } from "zod";
import {
  Form as JsonSchemaForm,
  FormProvider as JsonSchemaFormProvider,
  BaseFormRoot as JsonSchemaBaseFormRoot,
  BaseTemplates as JsonSchemaBaseTemplates,
  FormgenJSONSchema7,
  useFormContext as useJsonSchemaFormContext,
  FormState as JsonSchemaFormState,
} from "@react-formgen/json-schema";

import {
  Form as YupForm,
  FormProvider as YupFormProvider,
  BaseFormRoot as YupBaseFormRoot,
  BaseTemplates as YupBaseTemplates,
  useFormContext as useYupFormContext,
  FormState as YupFormState,
} from "@react-formgen/yup";

import {
  Form as ZodForm,
  FormProvider as ZodFormProvider,
  BaseFormRoot as ZodBaseFormRoot,
  BaseTemplates as ZodBaseTemplates,
  useFormContext as useZodFormContext,
  FormState as ZodFormState,
} from "@react-formgen/zod";

import { jsonSchema } from "./schemas/jsonSchema.ts";
import { yupSchema } from "./schemas/yupSchema.ts";
import { zodSchema } from "./schemas/zodSchema.ts";

export const jsonSchemaBasic: FormgenJSONSchema7 = {
  title: "User Form",
  description: "A simple user form",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
      minLength: 1,
      maxLength: 100,
      pattern: "^[A-Za-z]+$",
      description: "The person's first name.",
    },
    lastName: {
      type: "string",
      title: "Last Name",
      minLength: 1,
      maxLength: 100,
      pattern: "^[A-Za-z]+$",
      description: "The person's last name.",
    },
    age: {
      type: "integer",
      title: "Age",
      minimum: 0,
      maximum: 150,
      description: "The person's age.",
    },
    email: {
      type: "string",
      format: "email",
      title: "Email Address",
      description: "The person's email address.",
    },
  },
  required: ["firstName", "lastName", "email"],
};

export const yupSchemaBasic = Yup.object({
  firstName: Yup.string()
    .min(1)
    .max(100)
    .matches(/^[A-Za-z]+$/, "Invalid name")
    .required("Required")
    .meta({ title: "First Name", description: "The person's first name." }),
  lastName: Yup.string()
    .min(1)
    .max(100)
    .matches(/^[A-Za-z]+$/, "Invalid last name")
    .required("Required")
    .meta({ title: "Last Name", description: "The person's last name." }),
  age: Yup.number().integer().min(0).max(150).meta({
    title: "Age",
    description: "The person's age.",
  }),
  email: Yup.string().email().required("Required").meta({
    title: "Email",
    description: "The person's email address.",
  }),
});

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

// Generic hook that returns the readonly state and setter based on the context hook provided
function useFormReadonly<
  T extends JsonSchemaFormState | YupFormState | ZodFormState,
>(contextHook: <U>(selector: (state: T) => U) => U) {
  const readonly = contextHook((state) => state.readonly);
  const setReadonly = contextHook((state) => state.setReadonly);
  return { readonly, setReadonly };
}

// Generic SwitchToReadonly component that accepts a context hook and uses it to access the form state
const SwitchToReadonly = <
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
            templates={JsonSchemaBaseTemplates}
            formRoot={JsonSchemaBaseFormRoot}
            onSubmit={(data) => console.log("JSON Schema:", data)}
            onError={(errors) => console.error("JSON Schema:", errors)}
          ></JsonSchemaForm>

          <h2>JSON Schema Form (Readonly)</h2>
          <JsonSchemaForm
            schema={jsonSchemaBasic}
            initialData={initialFormData}
            readonly
          ></JsonSchemaForm>
        </div>

        <div style={formWrapperStyle}>
          <h2>Yup Schema Form</h2>

          <YupForm
            schema={yupSchemaBasic}
            initialData={initialFormData}
            templates={YupBaseTemplates}
            formRoot={YupBaseFormRoot}
            onSubmit={(data) => console.log("Yup:", data)}
            onError={(errors) => console.error("Yup:", errors)}
          ></YupForm>

          <h2>Yup Schema Form (Readonly)</h2>

          <YupForm
            schema={yupSchemaBasic}
            initialData={initialFormData}
            readonly
          ></YupForm>
        </div>

        <div style={formWrapperStyle}>
          <h2>Zod Schema Form</h2>

          <ZodForm
            schema={zodSchemaBasic}
            initialData={initialFormData}
            templates={ZodBaseTemplates}
            formRoot={ZodBaseFormRoot}
            onSubmit={(data) => console.log("Zod:", data)}
            onError={(errors) => console.error("Zod:", errors)}
          ></ZodForm>

          <h2>Zod Schema Form (Readonly)</h2>

          <ZodForm
            schema={zodSchemaBasic}
            initialData={initialFormData}
            readonly
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
            templates={JsonSchemaBaseTemplates}
          >
            <SwitchToReadonly contextHook={useJsonSchemaFormContext} />
            <JsonSchemaBaseFormRoot
              onSubmit={(data) => console.log("JSON Schema:", data)}
              onError={(errors) => console.error("JSON Schema:", errors)}
            />
          </JsonSchemaFormProvider>
        </div>

        <div style={formWrapperStyle}>
          <h2>Yup Schema Form</h2>
          <YupFormProvider
            schema={yupSchema}
            initialData={initialFormData}
            templates={YupBaseTemplates}
          >
            <SwitchToReadonly contextHook={useYupFormContext} />
            <YupBaseFormRoot
              onSubmit={(data) => console.log("Yup:", data)}
              onError={(errors) => console.error("Yup:", errors)}
            />
          </YupFormProvider>
        </div>

        <div style={formWrapperStyle}>
          <h2>Zod Schema Form</h2>
          <ZodFormProvider
            schema={zodSchema}
            initialData={initialFormData}
            templates={ZodBaseTemplates}
          >
            <SwitchToReadonly contextHook={useZodFormContext} />
            <ZodBaseFormRoot
              onSubmit={(data) => console.log("Zod:", data)}
              onError={(errors) => console.error("Zod:", errors)}
            />
          </ZodFormProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
