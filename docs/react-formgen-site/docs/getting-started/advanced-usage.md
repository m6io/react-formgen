---
sidebar_position: 5
---

# Advanced Usage

## Creating Custom Renderers

Custom renderers allow you to define how specific types of fields should be rendered. Here's a basic example:

```jsx
const customRenderer = {
  string: ({ field }) => <input {...field.inputProps} />,
  number: ({ field }) => <input type="number" {...field.inputProps} />,
  // ... other field types
};

function MyForm() {
  return (
    <FormProvider schema={mySchema} renderer={customRenderer}>
      {/* Form fields will use the custom renderer */}
    </FormProvider>
  );
}
```

## Extending Supported Schemas

To support a new schema type, you can create a custom plugin. Here's a simplified example:

```typescript
const myCustomPlugin: FormGenPlugin<MySchema, MyData, MyConfig> = {
  validateSchema: (schema) => {
    // Implement schema validation logic
  },
  getInitialValues: (schema) => {
    // Generate initial values based on the schema
  },
  // ... implement other required methods
};

const { FormProvider, useField } = createFormsProvidersAndHooks(myCustomPlugin);
```