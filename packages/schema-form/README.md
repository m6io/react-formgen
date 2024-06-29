# @m6oss/schema-form = A JSON Schema to React Form Generator

A type-safe, customizable, and super simple React form generator.

[See it in action!](https://stackblitz.com/~/github.com/m6io/js-to-form-example?file=src/App.tsx)

Takes a JSON Schema, some initial data (if you have any), and a few callbacks (onSubmit and onError), and returns a form with input validation and error handling.

Internally, this package uses [Ajv](https://ajv.js.org/) for JSON Schema validation and Zustand for state management.

Can be used with (almost) any UI component library, including your own.

Use cases:

1. You don't want (or don't have time) to write a bunch of forms from scratch.
2. You want to share JSON Schema with your backend to have a consistent end-to-end validation experience (one schema to rule them all! 🧙‍♂️).
3. You want to generate forms dynamically (e.g., for a CMS, a form builder, a configuration tool, etc.).

## Installation

Install with npm

```bash
npm install @m6oss/schema-form
```

or with Yarn

```bash
yarn add @m6oss/schema-form
```

## Usage

You'll need a JSON Schema that follows the [JSON Schema Draft 7](https://json-schema.org/specification-links.html#draft-7) specification. You can use the [JSON Schema Generator](https://jsonschema.net/) to create a schema from a JSON object. Or look through [JSON Schema Store](https://json.schemastore.org/) for examples.

### A simple example:

Create a new React app:

with NPM

```bash
npm create vite@latest schema-form-example --template react-ts
```

or with Yarn

```bash
yarn create vite schema-form-example --template react-ts
```

Open your new React app and paste this JSON Schema in a new file called `src/schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "A registration form",
  "description": "A simple form example.",
  "type": "object",
  "required": ["firstName", "lastName"],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name",
      "default": "Chuck"
    },
    "lastName": {
      "type": "string",
      "title": "Last name"
    },
    "age": {
      "type": "integer",
      "title": "Age"
    },
    "bio": {
      "type": "string",
      "title": "Bio"
    },
    "password": {
      "type": "string",
      "title": "Password",
      "minLength": 3
    },
    "telephone": {
      "type": "string",
      "title": "Telephone",
      "minLength": 10
    }
  }
}
```

Then replace the contents of `src/App.tsx` with the following:

```tsx
import { Form, JSONSchema7 } from '@m6oss/schema-form';
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
```

Run it with NPM

```bash
npm run dev
```

or with Yarn

```bash
yarn dev
```

You should see a form with the fields defined in the JSON Schema. The form will validate the data according to the schema and display any errors under the corresponding fields.

### A more complicated example:

This example should give you an idea of how to customize your form's components and access the FormProvider's store to display form data and form errors.

```tsx
import formSchema from './schema.json';
import formSchemaAlt from './schema-alt.json';
import {
  useFormContext,
  StringSchema,
  Form,
  FormComponent,
  JSONSchema7,
  FormProvider,
} from '@m6oss/schema-form';

// Example of a component that can be wrapped in FormProvider to display data from the form store
const FormDataDisplay: React.FC = () => {
  const formData = useFormContext((state) => state.formData);

  return (
    <pre>
      <code>{JSON.stringify(formData, null, 2)}</code>
    </pre>
  );
};

// Example of a Custom String Field Component
const MyStringField: React.FC<{
  schema: StringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const formData = useFormContext((state) => state.formData);
  const setFormData = useFormContext((state) => state.setFormData);
  const valueAtPath = path.reduce((acc, key) => acc?.[key], formData) ?? null;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(path, event.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {schema.title && <label>{schema.title}</label>}
      <input
        type='text'
        value={valueAtPath ?? ''}
        onChange={handleChange}
        placeholder={schema.title || ''}
        list={
          Array.isArray(schema.examples)
            ? `${path.join('-')}-datalist`
            : undefined
        }
        style={{
          width: '200px',
          border: '1px solid mediumslateblue',
          padding: '5px',
          borderRadius: '5px',
          marginBottom: '5px',
        }}
      />

      {schema.description && <small>{schema.description}</small>}
      {Array.isArray(schema.examples) && (
        <datalist id={`${path.join('-')}-datalist`}>
          {schema.examples.map((example, index) => (
            <option key={index} value={example as string} />
          ))}
        </datalist>
      )}
    </div>
  );
};

// Example of a component that can be used to display the title and description of the schema
const FormHeader: React.FC = () => {
  const schema = useFormContext((state) => state.schema);

  // Render the title and description of the schema, if available.
  return (
    <div>
      <h1>{schema.title}</h1>
      <p>{schema.description}</p>
    </div>
  );
};

// Examle of a component that can be used to display a scrollable, fixed max-height list of errors, if any.
const FormErrors: React.FC = () => {
  const errors = useFormContext((state) => state.errors);

  if (!errors) return null;

  // Errors that occur due to missing required fields will have an empty instancePath, so we need to parse the error params and add the missing property to the instancePath.
  const renderedErrors = errors.map((error) => {
    if (error.keyword === 'required' && error.params.missingProperty) {
      return {
        ...error,
        instancePath: `${error.instancePath}/${error.params.missingProperty}`,
      };
    }
    return error;
  });

  return (
    <div
      style={{
        maxHeight: '100px',
        overflowY: 'auto',
        border: '1px solid red',
        padding: '10px',
        margin: '10px 0',
      }}
    >
      <h3>Form Errors</h3>
      {renderedErrors.map((error, index) => (
        <div key={index} style={{ color: 'red' }}>
          {/* Parse the instancePath of the errors as a breadcrumb of the keys to the error, as well as the error message */}
          {error.instancePath.split('/').filter(Boolean).join(' > ')}:{' '}
          {error.message}
        </div>
      ))}
    </div>
  );
};

// Example App Component
const App: React.FC = () => {
  const schema: JSONSchema7 = formSchema as JSONSchema7;
  const schemaAlt: JSONSchema7 = formSchemaAlt as JSONSchema7;

  const initialData = {
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com',
    homepage: 'https://example.com',
    birthday: '1990-01-01',
    is_active: true,
    address: {
      street_address: '123 Main St',
      city: 'Somewhere',
      state: 'CA',
    },
  };
  const initialDataAlt = {};

  return (
    <>
      {/* Example of a form using Form component with custom text field component. */}
      <Form
        schema={schema}
        initialData={initialData}
        onSubmit={(data) => console.log('Form submitted:', data)}
        onError={(errors) => console.error('Form errors:', errors)}
        customFields={{ StringField: MyStringField }}
      />
      {/* Example of a form using FormProvider to wrap the form, display form data, and display a list of form errors. */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          width: 'calc(100vw - 60px)',
          gap: '20px',
        }}
      >
        <FormProvider schema={schema} initialData={initialData}>
          <div style={{ width: '50%' }}>
            <h1>JSON Schema Form</h1>
            <FormErrors />
            <FormComponent
              onSubmit={(data) => console.log('Form submitted:', data)}
              onError={(errors) => console.error('Form errors:', errors)}
            />
          </div>
          <div style={{ width: '25%' }}>
            <h1>Form Data</h1>
            <FormDataDisplay />
          </div>
        </FormProvider>
      </div>
      {/* Example of a form with a different schema, a custom form header, and a custom form error display. */}
      <FormProvider schema={schemaAlt} initialData={initialDataAlt}>
        <FormHeader />
        <FormErrors />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            width: 'calc(100vw - 60px)',
            gap: '20px',
          }}
        >
          <div style={{ width: '50%' }}>
            <h3>JSON Schema Form Alt</h3>
            <FormComponent
              onSubmit={(data) => console.log('Form Alt submitted:', data)}
              onError={(errors) => console.error('Form Alt errors:', errors)}
            />
          </div>
          <div style={{ width: '25%' }}>
            <h3>Form Data Alt</h3>
            <FormDataDisplay />
          </div>
        </div>
      </FormProvider>
    </>
  );
};

export default App;
```

## Known Issues and Limitations

This library is still in development and may have some issues. Here are some known issues and limitations:

1. The library does not support all JSON Schema Draft 7 features. Some features may not work as expected or may not work at all.
2. Error messages are direct outputs from the [Ajv](https://ajv.js.org/) library. As such, they may not be the most user-friendly or localized.
