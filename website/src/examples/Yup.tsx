import {
  Form,
  FormProvider,
  BaseFormRoot,
  useFormContext,
} from "@react-formgen/yup";
import { yupSchema, yupSchemaBasic } from "../schemas/yupSchema";
import { SwitchToReadonly } from "../components/SwitchToReadonly";

const initialFormData = {
  firstName: "John Doe",
  lastName: "Doe John",
  age: 69,
  email: "johndoe@joedohn.com",
};

const YupSchemaExample = () => {
  return (
    <div>
      <h2>Yup Schema Form</h2>
      <Form
        schema={yupSchemaBasic}
        initialData={initialFormData}
        onSubmit={(data) => console.log("Yup:", data)}
        onError={(errors) => console.error("Yup:", errors)}
      />

      <h2>Yup Schema Form (Readonly)</h2>
      <Form schema={yupSchemaBasic} initialData={initialFormData} readonly />
    </div>
  );
};

const YupSchemaComplexExample = () => {
  return (
    <div>
      <h2>Complex Yup Schema Form</h2>
      <FormProvider schema={yupSchema} initialData={initialFormData}>
        <SwitchToReadonly contextHook={useFormContext} />
        <BaseFormRoot
          onSubmit={(data) => console.log("Yup:", data)}
          onError={(errors) => console.error("Yup:", errors)}
        />
      </FormProvider>
    </div>
  );
};

export { YupSchemaExample, YupSchemaComplexExample };
