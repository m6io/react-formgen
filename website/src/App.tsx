import {
  FormProvider,
  BaseFormTemplate,
  BaseDisplayTemplate,
  BaseFieldTemplates,
} from "@react-formgen/json-schema";
import { schema as formSchemaAsTs } from "./schema.ts";

const App = () => {
  return (
    <div>
      <h1>{formSchemaAsTs.title || "Untitled Form"}</h1>
      <p>{formSchemaAsTs.description || null}</p>
      <hr />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          margin: "1rem",
          border: "1px solid black",
          borderRadius: "1rem",
        }}
      >
        <FormProvider
          schema={formSchemaAsTs}
          initialData={{
            firstName: "John Doe",
            lastName: "Doe John",
            age: 69,
            email: "johndoe@joedohn.com",
          }}
        >
          <BaseFormTemplate
            fieldTemplates={BaseFieldTemplates}
            onSubmit={(data) => console.log(data)}
            onError={(errors) => console.error(errors)}
          />
          <BaseDisplayTemplate fieldTemplates={BaseFieldTemplates} />
        </FormProvider>
      </div>
    </div>
  );
};

export default App;
