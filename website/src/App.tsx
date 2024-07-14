import { Form, JSONSchema7, ErrorObject } from "@react-formgen/json-schema";
import formSchema from "./schema.json";
import { schema as formSchemaAsTs } from "./schema.ts";

const App = () => {
  return (
    <div>
      <h1>{formSchema.title || "Untitled Form"}</h1>
      <p>{formSchema.description || null}</p>
      <hr />
      <Form
        schema={formSchema as JSONSchema7}
        onSubmit={(data: { [key: string]: unknown }) => console.log(data)}
        onError={(errors: ErrorObject[]) => console.error(errors)}
      />
      <hr />
      <h1>{formSchemaAsTs.title || "Untitled Form 2"}</h1>
      <p>{formSchemaAsTs.description || null}</p>
      <hr />
      <Form
        schema={formSchemaAsTs}
        onSubmit={(data: { [key: string]: unknown }) => console.log(data)}
        onError={(errors: ErrorObject[]) => console.error(errors)}
      />
    </div>
  );
};

export default App;
