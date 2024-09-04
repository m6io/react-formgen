---
sidebar_position: 2
---

# Core Concepts

## JSON Schema and Form Generation

React FormGen uses schemas (like JSON Schema) to define the structure and validation rules for your forms. The library interprets these schemas to:

1. Generate appropriate form fields
2. Handle data binding
3. Manage form state
4. Perform validation

While JSON Schema is the primary supported format, React FormGen's modular architecture allows for easy integration with other schema types like Yup and Zod.

## Headless UI Approach

React FormGen takes a headless UI approach, meaning it doesn't provide any pre-built UI components. Instead, it gives you the tools to manage form state and behavior, allowing you to implement your own UI components or integrate with existing UI libraries.

Benefits of this approach include:

- Complete control over form appearance
- Easier integration with design systems
- Better performance, as you only render what you need
- More flexibility in handling complex form scenarios

## Modularity and Extensibility

React FormGen is built with modularity in mind. Its core package provides the fundamental form management capabilities, while separate packages handle specific schema types.

This modular approach allows you to:

- Only include the functionality you need
- Easily extend the library to support new schema types
- Create custom renderers for specific UI requirements
- Optimize your bundle size by only including necessary modules