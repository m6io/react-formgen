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
- **Array Manipulation**: Simplifies the management of array-based fields in your forms.
- **Templating Support**: Supports custom templates and render templates to create flexible forms.

## Installation

Install the package:

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
  useArrayTemplate,
  useTemplates,
  useRenderTemplate,
  Form,
} = createFormProviderAndHooks<SomeSchemaType, SomeErrorType>(
  createInitialData,
  getErrorsAtPath,
  DefaultRenderTemplate,
  BaseFormRoot,
  BaseTemplates
);
```

### Using the Form or FormProvider Components

Wrap your form components with the `Form` or `FormProvider` to provide the form state context.

```tsx
import React from "react";
import { Form, FormProvider } from "./your-custom-formgen-library";
import MyFormRoot from "./MyFormRoot";

const MyForm = () => {
  const schema = {}; // Define your schema
  const initialData = {}; // Define initial data if any
  const handleSubmit = (data) => {
    console.log("Form submitted with data:", data);
  };
  const handleErrors = (errors) => {
    console.error("Form submission errors:", errors);
  };

  return (
    <Form
      schema={schema}
      initialData={initialData}
      onSubmit={handleSubmit}
      onError={handleErrors}
    />

    // or

    <FormProvider schema={schema} initialData={initialData}>
      <MyFormRoot
        onSubmit={handleSubmit}
        onError={handleErrors}
      />
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
  const [value, setValue] = useFormDataAtPath(["path", "to", "field"]);
  const errors = useErrorsAtPath(["path", "to", "field"]);

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

### `createFormProviderAndHooks(generateInitialData, getErrorsAtPath, BaseRenderTemplate, BaseFormRoot?, BaseTemplates?)`

Creates schema-specific form provider and hooks.

- `generateInitialData(schema)`: Function to generate initial form data from the schema.
- `getErrorsAtPath(errors, path)`: Function to get errors at a specific path.
- `BaseRenderTemplate`: Component for rendering form fields.
- `BaseFormRoot`: (Optional) Root form component for managing submission.
- `BaseTemplates`: (Optional) Object mapping template names to React components.

Returns an object containing:

- `FormProvider`: A React component to provide the form state context.
- `useFormContext`: Hook to access the form context.
- `useFormDataAtPath`: Hook to get and set form data at a specific path.
- `useErrorsAtPath`: Hook to get errors at a specific path.
- `useArrayTemplate`: Hook for array manipulation (add, remove, move items).
- `useTemplates`: Hook to access the templates.
- `useRenderTemplate`: Hook to access the render template component.
- `Form`: A generalized Form component for rendering forms.

### `FormState<S, E>`

Represents the state of the form.

- `schema`: The schema of the form.
- `formData`: The current form data.
- `errors`: The current form errors.
- `readonly`: Whether the form is in read-only mode.
- `setFormData(path: string[], value: any)`: Function to set form data at a specific path.
- `setErrors(errors: E[] | null)`: Function to set form errors.
- `setReadonly(readonly: boolean)`: Function to set the read-only state.

### `FormProviderProps<S>`

Props for the `FormProvider` component.

- `initialData?`: Initial form data.
- `schema`: The schema of the form.
- `children`: The child components.
- `createInitialData(schema: S)`: Function to create initial data from the schema.
- `templates?`: An object mapping template names to React components.
- `readonly?`: Whether the form should be initially read-only.
- `renderTemplate?`: A React component for rendering form fields.

### `RenderTemplateProps<S>`

Props for the render template component.

- `schema`: The schema of the form.
- `path`: The path to the current form data.

### `useFormDataAtPath(path: string[], defaultOnNull: unknown)`

Hook to get and set form data at a specific path.

- `path`: Path to the form data.
- `defaultOnNull`: Value to return if the form data at the path is null.

### `useErrorsAtPath(path: string[])`

Hook to retrieve validation errors at a specific path.

### `useArrayTemplate(path: string[], zeroState: () => any, defaultOnNull: any)`

Hook to manage array properties within the form state.

### `useTemplates()`

Hook to access the templates from the context.

### `useRenderTemplate()`

Hook to access the render template component from the context.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
