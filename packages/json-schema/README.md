# @react-formgen/json-schema

A headless, type-safe, customizable, and super simple React form and data view generator from JSON Schema.

[![npm version](https://badge.fury.io/js/@react-formgen%2Fjson-schema.svg)](https://badge.fury.io/js/@react-formgen%2Fjson-schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`@react-formgen/json-schema` transforms a JSON Schema into dynamic forms and data views with built-in validation and error handling. It leverages [Ajv](https://ajv.js.org/) for validation and Zustand for efficient state management.

### Use cases

1. You don't want (or don't have time) to write a bunch of forms from scratch.
2. You want to share JSON Schema with your backend to have a consistent end-to-end validation experience (one schema to rule them all! 🧙‍♂️).
3. You want to generate forms dynamically (e.g., for a CMS, a form builder, a configuration tool, etc.).

### Features

- **Type-safe**: Ensures your forms adhere to the defined schema.
- **Customizable**: Allows custom templates, layouts, and rendering logic.
- **Headless**: Integrates with any UI component library.
- **Validation**: Built-in validation and error handling.

## Installation

Install with npm:

```bash
npm install @react-formgen/json-schema ajv ajv-formats json-schema
```

with Yarn

```bash
yarn add @react-formgen/json-schema ajv ajv-formats json-schema
```

with pnpm

```bash
pnpm install @react-formgen/json-schema ajv ajv-formats json-schema
```

## Usage

Here’s how you can quickly create a form using a JSON Schema:

### 1. Setup a new React project

```bash
npm create vite@latest react-formgen-example --template react-ts
```

or with Yarn

```bash
yarn create vite react-formgen-example --template react-ts
```

or with pnpm

```bash
pnpm create vite react-formgen-example --template react-ts
```

### 2. Define a JSON Schema

Create a `src/schema.json` file:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User Registration",
  "type": "object",
  "required": ["firstName", "lastName"],
  "properties": {
    "firstName": { "type": "string", "title": "First Name" },
    "lastName": { "type": "string", "title": "Last Name" },
    "age": { "type": "integer", "title": "Age" }
  }
}
```

### 3. Create the form in `src/App.tsx`

```tsx
import React from "react";
import { Form } from "@react-formgen/json-schema";
import schema from "./schema.json";

const App = () => {
  return (
    <div>
      <h1>{schema.title}</h1>
      <Form
        schema={schema}
        onSubmit={(data) => console.log("Form submitted:", data)}
        onError={(errors) => console.error("Validation errors:", errors)}
      />
    </div>
  );
};

export default App;
```

### 4. Run the application

```bash
npm dev
```

or with Yarn

```bash
yarn dev
```

or with pnpm

```bash
pnpm dev
```

You will now see a form generated based on the JSON Schema, with built-in validation and error handling.

## Customization

You can easily customize field rendering by passing your own field components:

```tsx
import React from "react";
import { Form, BaseTemplates } from "@react-formgen/json-schema";

// Example: Custom field for string inputs
const CustomStringTemplate = ({ schema, path, value, setValue }) => (
  <div>
    <label>{schema.title}</label>
    <input value={value} onChange={(e) => setValue(e.target.value)} />
  </div>
);

const App = () => {
  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "User Registration",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: { type: "string", title: "First Name" },
      lastName: { type: "string", title: "Last Name" },
      age: { type: "integer", title: "Age" },
    },
  };

  const handleSubmit = (data) => {
    console.log("Form submitted with data:", data);
  };

  const handleErrors = (errors) => {
    console.error("Form submission errors:", errors);
  };

  return (
    <Form
      schema={schema}
      templates={{ ...BaseTemplates, StringTemplate: CustomStringTemplate }}
      onSubmit={handleSubmit}
      onError={handleErrors}
    />

    // a read-only data view

    <Form schema={schema} readonly />
  );
};
```

## Known Issues

1. The library does not support all JSON Schema Draft 7 features. Some features may not work as expected or may not work at all.
2. Error messages are direct outputs from the [Ajv](https://ajv.js.org/) library. As such, they may not be the most user-friendly or localized. You can (and should) customize your `ajv` instance to provide better error messages in your custom `FormRoot` component.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
