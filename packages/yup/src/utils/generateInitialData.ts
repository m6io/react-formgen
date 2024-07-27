import {
  ObjectSchema,
  StringSchema,
  NumberSchema,
  BooleanSchema,
  ArraySchema,
  AnySchema,
  string,
} from "yup";

// Extend AnySchema to include the processingTag
interface TaggedSchema extends AnySchema {
  [processingTag]?: boolean;
}

// Unique symbol to tag schemas during processing
const processingTag = Symbol("processing");

type InitialData =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | unknown[];

export const generateInitialData = (
  schema: TaggedSchema,
  path: string = "root"
): InitialData => {
  if (schema[processingTag]) {
    // Log error and modify the schema
    const errorMessage = `Infinite recursion detected in schema at path: ${path}`;
    console.error(errorMessage);

    // Change the schema to a readonly string schema with the error message
    schema = string().default(errorMessage);
  }

  // Tag the schema to indicate it is being processed
  schema[processingTag] = true;

  let initialData: InitialData;

  if (schema instanceof ObjectSchema) {
    initialData = {};
    for (const [key, value] of Object.entries(schema.fields)) {
      initialData[key] = generateInitialData(
        value as TaggedSchema,
        `${path}.${key}`
      );
    }
  } else if (schema instanceof ArraySchema) {
    initialData = [];
  } else if (schema instanceof StringSchema) {
    initialData =
      schema.spec.default !== undefined ? schema.spec.default : undefined;
  } else if (schema instanceof NumberSchema) {
    initialData =
      schema.spec.default !== undefined ? schema.spec.default : undefined;
  } else if (schema instanceof BooleanSchema) {
    initialData =
      schema.spec.default !== undefined ? schema.spec.default : undefined;
  } else {
    initialData =
      schema.spec.default !== undefined ? schema.spec.default : undefined;
  }

  // Clean up the tag after processing
  delete schema[processingTag];

  return initialData;
};
