import { FormgenJSONSchema7 } from "@react-formgen/json-schema";

export const jsonSchema: FormgenJSONSchema7 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Example Schema",
  description: "A schema representing a complex object with various features.",
  type: "object",
  definitions: {
    address: {
      title: "Address",
      description: "An tuple containing the street address, city, and state.",
      type: "array",
      items: [
        {
          title: "Street Address",
          description: "The street address.",
          type: "string",
        },
        {
          title: "City",
          description: "The city.",
          type: "string",
        },
        {
          title: "State",
          description:
            "The state. This field has an enum, so it will render as a select input.",
          type: "string",
          // prettier-ignore
          enum: [
            "AL", "AK", "AS", "AZ", "AR",
            "CA", "CO", "CT", "DE", "DC",
            "FM", "FL", "GA", "GU", "HI",
            "ID", "IL", "IN", "IA", "KS",
            "KY", "LA", "ME", "MH", "MD",
            "MA", "MI", "MN", "MS", "MO",
            "MT", "NE", "NV", "NH", "NJ",
            "NM", "NY", "NC", "ND", "MP",
            "OH", "OK", "OR", "PW", "PA",
            "PR", "RI", "SC", "SD", "TN",
            "TX", "UT", "VT", "VI", "VA",
            "WA", "WV", "WI", "WY",
          ],
        },
      ],
      additionalItems: false,
      minItems: 3,
      maxItems: 3,
    },
    friend: {
      title: "Friend",
      description: "An object representing a friend.",
      type: "object",
      properties: {
        name: {
          title: "Name",
          description: "The friend's name.",
          minLength: 1,
          maxLength: 100,
          type: "string",
        },
        age: {
          title: "Age",
          description: "The friend's age.",
          type: "integer",
          minimum: 0,
          maximum: 150,
        },
        address: {
          title: "Address",
          description: "The friend's address.",
          $ref: "#/definitions/address",
        },
      },
      required: ["name", "address"],
    },
  },
  properties: {
    firstName: {
      title: "First Name",
      description: "The person's first name.",
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^[A-Za-z]+$",
    },
    lastName: {
      title: "Last Name",
      description: "The person's last name.",
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^[A-Za-z]+$",
    },
    age: {
      title: "Age",
      description: "The person's age.",
      type: "integer",
      minimum: 0,
      maximum: 150,
    },
    email: {
      title: "Email",
      description: "The person's email address.",
      type: "string",
      format: "email",
    },
    phone: {
      title: "Phone",
      description: "The person's phone number.",
      type: "string",
    },
    ssn: {
      title: "SSN",
      description: "The person's social security number.",
      type: "string",
      format: "password",
    },
    homepage: {
      title: "Homepage",
      description: "The person's homepage URL.",
      type: "string",
      format: "uri",
    },
    birthday: {
      title: "Birthday",
      description: "The person's birthday.",
      type: "string",
      format: "date",
    },
    is_active: {
      title: "Is Active",
      description:
        "Indicates whether the person is active. Defined using schema composition via `oneOf`, each boolean value (`true` or `false`) is paired with a `title` for clarity. Renders as a radio input.",
      type: "boolean",
      oneOf: [
        {
          title: "Yes",
          const: true,
        },
        {
          title: "No",
          const: false,
        },
      ],
    },
    loves_cats: {
      title: "Loves Cats",
      description:
        "Indicates whether the person loves cats. This field has no complex definition, so it will render as a checkbox input.",
      type: "boolean",
    },
    loves_dogs: {
      title: "Loves Dogs",
      description:
        "Indicates whether the person loves dogs. This field has no complex definition, so it will render as a checkbox input.",
      type: "boolean",
    },
    loves_pizza: {
      title: "Loves Pizza",
      description:
        "Indicates whether the person loves pizza. Defined using schema composition via `oneOf`, each boolean value (`true` or `false`) is paired with a `title` for clarity. Renders as a radio input.",
      type: "boolean",
      default: true,
      oneOf: [
        {
          title: "🍕",
          const: true,
        },
        {
          title: "🙅‍♂️",
          const: false,
        },
      ],
    },
    loves_tacos: {
      title: "Loves Tacos",
      description:
        "Indicates whether the person loves tacos. Defined using schema composition via `oneOf`, each boolean value (`true` or `false`) is paired with a `title` for clarity. Renders as a radio input.",
      type: "boolean",
      oneOf: [
        {
          title: "🌮",
          const: true,
        },
        {
          title: "🙅‍♂️",
          const: false,
        },
      ],
    },
    favorite_foods: {
      title: "Favorite Foods",
      description:
        "A list of favorite foods, unique and selected from predefined options.",
      type: "array",
      items: {
        oneOf: [
          { const: "Pizza", title: "🍕 Pizza" },
          { const: "Burger", title: "🍔 Burgers" },
          { const: "Tacos", title: "🌮 Tacos" },
          { const: "Sushi", title: "🍣 Sushi" },
        ],
      },
      uniqueItems: true,
      minItems: 1,
    },
    address: {
      title: "Address",
      description: "The person's address.",
      $ref: "#/definitions/address",
    },
    friends: {
      title: "Friends",
      description: "A list of the person's friends.",
      type: "array",
      items: {
        $ref: "#/definitions/friend",
      },
      minItems: 0,
      uniqueItems: true,
    },
    employment: {
      title: "Employment",
      description: "The person's employment details.",
      type: "object",
      properties: {
        employer: {
          title: "Employer",
          description: "The person's employer.",
          type: "string",
        },
        role: {
          title: "Role",
          description: "The person's role.",
          type: "string",
        },
        start_date: {
          title: "Start Date",
          description: "The date the person started the role.",
          type: "string",
          format: "date",
        },
        end_date: {
          title: "End Date",
          description: "The date the person ended the role.",
          type: "string",
          format: "date",
        },
        address: {
          title: "Address",
          description: "The address of the employment location.",
          $ref: "#/definitions/address",
        },
      },
      required: ["employer", "role", "start_date"],
    },
    projects: {
      title: "Projects",
      description: "A list of the person's projects.",
      type: "array",
      items: {
        title: "Project",
        description: "An object representing a project.",
        type: "object",
        properties: {
          name: {
            title: "Name",
            description: "The name of the project.",
            type: "string",
          },
          description: {
            title: "Description",
            description: "The description of the project.",
            type: "string",
          },
          start_date: {
            title: "Start Date",
            description: "The date the project started.",
            type: "string",
            format: "date",
          },
          end_date: {
            title: "End Date",
            description: "The date the project ended.",
            type: "string",
            format: "date",
          },
          team: {
            title: "Team",
            description: "The team members involved in the project.",
            type: "array",
            items: {
              $ref: "#/definitions/friend",
            },
          },
        },
        required: ["name", "description", "start_date"],
      },
      minItems: 0,
      uniqueItems: true,
    },
  },
  required: ["firstName", "lastName", "email", "address"],
};

export const jsonSchemaBasic: FormgenJSONSchema7 = {
  title: "User Form",
  description: "A simple user form",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
      minLength: 1,
      maxLength: 100,
      pattern: "^[A-Za-z]+$",
      description: "The person's first name.",
    },
    lastName: {
      type: "string",
      title: "Last Name",
      minLength: 1,
      maxLength: 100,
      pattern: "^[A-Za-z]+$",
      description: "The person's last name.",
    },
    age: {
      type: "integer",
      title: "Age",
      minimum: 0,
      maximum: 150,
      description: "The person's age.",
    },
    email: {
      type: "string",
      format: "email",
      title: "Email Address",
      description: "The person's email address.",
    },
  },
  required: ["firstName", "lastName", "email"],
};

export const jsonSchemaWithRecursiveRefs: FormgenJSONSchema7 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Person Schema",
  type: "object",
  properties: {
    name: {
      title: "Person's Name",
      $ref: "#/definitions/name",
    },
    age: {
      title: "Person's Age",
      $ref: "#/$defs/age",
    },
    child: {
      title: "Child Information",
      type: "object",
      properties: {
        childName: {
          title: "Child's Name",
          $ref: "#/definitions/childName",
        },
        childAge: {
          title: "Child's Age",
          $ref: "#/$defs/age",
        },
        childOfChild: {
          title: "Child of Child (Grandchild)",
          $ref: "#",
        },
      },
      definitions: {
        childName: {
          title: "Child Name Definition",
          type: "string",
          default: "Child Name",
        },
      },
    },
  },
  definitions: {
    name: {
      title: "Name Definition",
      type: "string",
      default: "John Doe",
    },
  },
  $defs: {
    age: {
      title: "Age Definition",
      type: "integer",
      default: 30,
    },
  },
};
