---
sidebar_position: 4
---
# API Reference

## Core API

### `createFormsProvidersAndHooks`

The main function provided by the core package. It sets up the form management system and returns a set of providers and hooks for working with forms.

```typescript
function createFormsProvidersAndHooks<
  TSchema,
  TData,
  TConfig extends FormConfig<TSchema, TData>
>(
  plugin: FormGenPlugin<TSchema, TData, TConfig>
): {
  FormProvider: React.ComponentType<FormProviderProps<TSchema, TData, TConfig>>;
  useField: UseFieldHook<TSchema, TData>;
  // ... other returned hooks and utilities
}
```

### `FormProvider`

A React component that provides the form context to its children.

```jsx
<FormProvider schema={mySchema} onSubmit={handleSubmit}>
  {/* Form fields go here */}
</FormProvider>
```

### `useField`

A hook for accessing and manipulating individual form fields.

```jsx
const { value, onChange, onBlur, error } = useField('fieldName');
```

## JSON Schema API

The JSON Schema plugin provides utilities for working with JSON Schema in React FormGen.

### `jsonSchemaPlugin`

The main plugin for integrating JSON Schema with React FormGen.

```javascript
import { jsonSchemaPlugin } from '@react-formgen/json-schema';

const { FormProvider, useField } = createFormsProvidersAndHooks(jsonSchemaPlugin);
```