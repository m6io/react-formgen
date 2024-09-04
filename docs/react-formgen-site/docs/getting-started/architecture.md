---
sidebar_position: 3
---
# Architecture

## Project Structure

React FormGen is organized into several packages:

- `@react-formgen/core`: The core library providing form management capabilities.
- `@react-formgen/json-schema`: Plugin for working with JSON Schema.
- `@react-formgen/yup`: Plugin for working with Yup schemas.
- `@react-formgen/zod`: Plugin for working with Zod schemas.

## Core Package

The core package (`@react-formgen/core`) is the heart of React FormGen. It provides:

- The `createFormsProvidersAndHooks` function for setting up form management
- Type definitions and interfaces for extending the library
- Basic form state management utilities

## Schema Packages

Schema packages (like `@react-formgen/json-schema`) provide the necessary logic to interpret specific schema types and integrate them with the core package. Each schema package typically includes:

- A plugin that extends the core functionality
- Utility functions for working with the specific schema type
- Custom hooks and components relevant to the schema type

## Render Templates

Render templates are a powerful feature of React FormGen that allow you to define how different types of form fields should be rendered. This can include:

- Rendering by field type (e.g., string, number, boolean)
- Rendering by format (e.g., date, email, password)
- Custom rendering logic for specific use cases

Render templates provide a flexible way to customize the appearance and behavior of your forms while still leveraging the form management capabilities of React FormGen.