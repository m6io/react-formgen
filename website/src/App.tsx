import { Form, JSONSchema7 } from '@react-formgen/json-schema';
import schema from './schema.json';

const App = () => {
  const formSchema: JSONSchema7 = schema as JSONSchema7;

  return (
    <div>
      <h1>{formSchema.title || 'Untitled Form'}</h1>
      <p>{formSchema.description || null}</p>
      <hr />
      <Form
        schema={formSchema as JSONSchema7}
        onSubmit={(data) => console.log(data)}
        onError={(errors) => console.error(errors)}
      />
    </div>
  );
};

export default App;
