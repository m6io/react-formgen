---
sidebar_position: 1
---

# Installation

To get started with React FormGen, install it via npm or yarn:

```bash
npm install @react-formgen/core @react-formgen/json-schema
# or
yarn add @react-formgen/core @react-formgen/json-schema
```

## Quick Start Guide

Here's a basic example to get you started with React FormGen:

```jsx
import { createFormsProvidersAndHooks } from '@react-formgen/core';
import { jsonSchemaPlugin } from '@react-formgen/json-schema';

const { FormProvider, useField } = createFormsProvidersAndHooks(jsonSchemaPlugin);

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  }
};

function MyForm() {
  const nameField = useField('name');
  const ageField = useField('age');

  return (
    <form>
      <input {...nameField.inputProps} />
      <input {...ageField.inputProps} type="number" />
    </form>
  );
}

function App() {
  return (
    <FormProvider schema={schema}>
      <MyForm />
    </FormProvider>
  );
}
```

This example demonstrates the basic usage of React FormGen with a JSON Schema. The library handles form state management and validation, while you retain full control over the rendering of form elements.
