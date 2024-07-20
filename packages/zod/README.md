# @react-formgen/zod

A headless, type-safe, customizable, and super simple React form and data view generator. Turn your Zod schemas into forms and data views with ease.

[![npm version](https://badge.fury.io/js/@react-formgen%2Fzod.svg)](https://badge.fury.io/js/@react-formgen%2Fzod)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Docs are boring, take me to the examples!](https://github.com/m6io/react-formgen/tree/main/examples)

Takes a Zod schema, some initial data (if you have any), and a few callbacks (onSubmit and onError), and returns a form with input validation and error handling.

Can be used with (almost) any UI component library, including your own.

Use cases:

1. You don't want (or don't have time) to write a bunch of forms from scratch.
2. You want to share Zod schema with your backend (assuming you're using something JS/TS based on the backend) to have a consistent end-to-end validation experience (one schema to rule them all! 🧙‍♂️).
3. You want to generate forms dynamically (e.g., for a CMS, a form builder, a configuration tool, etc.).

## Installation

Install with npm

```bash
npm install @react-formgen/zod
```

or with Yarn

```bash
yarn add @react-formgen/zod
```

Note: this package is an attempt to replicate the form-generating functionality introduced by [@react-formgen/json-schema](https://www.npmjs.com/package/@react-formgen/json-schema) but with Zod schemas instead of JSON schemas and Zod validation instead of Ajv validation.
