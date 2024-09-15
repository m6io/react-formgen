import {
  Form,
  FormProvider,
  BaseFormRoot,
  useFormContext,
} from "@react-formgen/zod";
import { zodSchema, zodSchemaBasic } from "../schemas/zodSchema";
import { SwitchToReadonly } from "../components/SwitchToReadonly";

const initialFormData = {
  firstName: "John Doe",
  lastName: "Doe John",
  age: 69,
  email: "johndoe@joedohn.com",
};

const ZodSchemaExample = () => {
  return (
    <div>
      <h2>Zod Schema Form</h2>
      <Form
        schema={zodSchemaBasic}
        initialData={initialFormData}
        onSubmit={(data) => console.log("Zod:", data)}
        onError={(errors) => console.error("Zod:", errors)}
      />

      <h2>Zod Schema Form (Readonly)</h2>
      <Form schema={zodSchemaBasic} initialData={initialFormData} readonly />
    </div>
  );
};

const ZodSchemaComplexExample = () => {
  return (
    <div>
      <h2>Complex Zod Schema Form</h2>
      <FormProvider schema={zodSchema} initialData={initialFormData}>
        <SwitchToReadonly contextHook={useFormContext} />
        <BaseFormRoot
          onSubmit={(data) => console.log("Zod:", data)}
          onError={(errors) => console.error("Zod:", errors)}
        />
      </FormProvider>
    </div>
  );
};

export { ZodSchemaExample, ZodSchemaComplexExample };
