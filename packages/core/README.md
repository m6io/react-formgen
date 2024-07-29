# @react-formgen/core

[![codecov](https://codecov.io/gh/m6io/react-formgen/branch/main/graph/badge.svg)](https://codecov.io/gh/m6io/react-formgen)
[![npm version](https://badge.fury.io/js/@react-formgen%2Fcore.svg)](https://badge.fury.io/js/@react-formgen%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A foundational library designed to facilitate the creation of schema-based form generators. It provides core functionality for state management, form data manipulation, and error handling, allowing developers to build form generators that can be extended for various schema types.

## Features

- **Schema-Agnostic Core**: Provides a framework for managing form state and validation errors without being tied to a specific schema format.
- **State Management**: Utilizes Zustand internally for efficient and scalable state management.
- **Custom Hooks**: Includes essential hooks for form data and error management.
- **Factory Functions**: Allows creation of schema-specific form providers and hooks, simplifying the extension for different schema types.

## Installation

Install the package via npm or yarn:

```bash
npm install @react-formgen/core
# or
yarn add @react-formgen/core
# or
pnpm add @react-formgen/core
```

## Usage

### Creating a Form Provider and Hooks

To create a schema-specific form provider and hooks, use the `createFormProviderAndHooks` factory function. This function requires a `generateInitialData` function for initializing form data and a `getErrorsAtPath` function for retrieving errors at specific paths.

```tsx
import { createFormProviderAndHooks } from "@react-formgen/core";

// Example: Initial data generator function
const generateInitialData = (schema) => {
  // Logic to generate initial data based on the schema
};

// Example: Function to get errors at a specific path
const getErrorsAtPath = (errors, path) => {
  // Logic to get errors at the specified path
};

// Create schema-specific form provider and hooks
const {
  FormProvider,
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
  useArrayFieldset,
} = createFormProviderAndHooks(generateInitialData, getErrorsAtPath);
```

### Using the Form Provider

Wrap your form components with the `FormProvider` to provide the form state context.

```tsx
import React from "react";
import { FormProvider } from "./your-custom-form-provider";

const MyForm = () => {
  const schema = {}; // Define your schema
  const initialData = {}; // Define initial data if any

  return (
    <FormProvider schema={schema} initialData={initialData}>
      {/* Your form components here */}
    </FormProvider>
  );
};

export default MyForm;
```

### Using Custom Hooks

Use the provided hooks to manage form state and handle errors.

```tsx
import React from "react";
import {
  useFormContext,
  useFormDataAtPath,
  useErrorsAtPath,
} from "./your-custom-schema-form-hooks";

const MyField = () => {
  const formData = useFormContext((state) => state.formData);
  const [value, setValue] = useFormDataAtPath(["path", "to", "field"]); // the implementation of this hook is up to you
  const errors = useErrorsAtPath(["path", "to", "field"]); // the implementation of this hook is up to you

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      {errors &&
        errors.map((error, index) => (
          <div key={index} style={{ color: "red" }}>
            {error.message}
          </div>
        ))}
    </div>
  );
};

export default MyField;
```

## API Reference

### `createFormProviderAndHooks(generateInitialData, getErrorsAtPath)`

Creates schema-specific form provider and hooks.

- `generateInitialData(schema)`: Function to generate initial form data from the schema.
- `getErrorsAtPath(errors, path)`: Function to get errors at a specific path.

Returns an object containing:

- `FormProvider`: A React component to provide the form state context.
- `useFormContext`: Hook to access the form context.
- `useFormDataAtPath`: Hook to get and set form data at a specific path.
- `useErrorsAtPath`: Hook to get errors at a specific path.
- `useArrayFieldset`: Hook for array manipulation (add, remove, move items).

### `FormState<S, E>`

Represents the state of the form.

- `schema`: The schema of the form.
- `formData`: The current form data.
- `errors`: The current form errors.
- `setFormData(path: string[], value: any)`: Function to set form data at a specific path.
- `setErrors(errors: E[] | null)`: Function to set form errors.

### `FormProviderProps<S>`

Props for the `FormProvider` component.

- `initialData?`: Initial form data.
- `schema`: The schema of the form.
- `children`: The child components.
- `createInitialData(schema: S)`: Function to create initial data from the schema.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
