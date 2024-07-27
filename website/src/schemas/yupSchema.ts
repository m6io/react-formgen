import * as Yup from "yup";

// Address Schema Definition
const addressSchema = Yup.object()
  .shape({
    street_address: Yup.string()
      .required()
      .meta({ title: "Street Address", description: "The street address." }),
    city: Yup.string()
      .required()
      .meta({ title: "City", description: "The city." }),
    state: Yup.string()
      .oneOf([
        "AL",
        "AK",
        "AS",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "DC",
        "FM",
        "FL",
        "GA",
        "GU",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MH",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "MP",
        "OH",
        "OK",
        "OR",
        "PW",
        "PA",
        "PR",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VI",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
      ])
      .required()
      .meta({
        title: "State",
        description:
          "The state. This field has an enum, so it will render as a select input.",
      }),
    notes: Yup.string().meta({
      title: "Notes",
      description:
        "Additional notes about the address. This field has a uiSchema of textarea, so it will render as a textarea input.",
      uiSchema: { component: "textarea" },
    }),
  })
  .meta({
    title: "Address",
    description: "An object representing an address.",
  });

// Friend Schema Definition
const friendSchema = Yup.object()
  .shape({
    name: Yup.string()
      .required()
      .meta({ title: "Name", description: "The friend's name." }),
    age: Yup.number()
      .integer()
      .min(0)
      .max(150)
      .meta({ title: "Age", description: "The friend's age." }),
    address: addressSchema.meta({
      title: "Address",
      description: "The friend's address.",
    }),
  })
  .meta({ title: "Friend", description: "An object representing a friend." });

// Main Schema Definition
export const yupSchema = Yup.object()
  .shape({
    firstName: Yup.string()
      .min(1)
      .max(100)
      .matches(/^[A-Za-z]+$/, { message: "Invalid name" })
      .required()
      .meta({ title: "First Name", description: "The person's first name." }),
    lastName: Yup.string()
      .min(1)
      .max(100)
      .matches(/^[A-Za-z]+$/, { message: "Invalid last name" })
      .required()
      .meta({ title: "Last Name", description: "The person's last name." }),
    age: Yup.number()
      .integer()
      .min(0)
      .max(150)
      .meta({ title: "Age", description: "The person's age." }),
    email: Yup.string()
      .email()
      .required()
      .meta({ title: "Email", description: "The person's email address." }),
    phone: Yup.string().meta({
      title: "Phone",
      description: "The person's phone number.",
    }),
    ssn: Yup.string().meta({
      title: "SSN",
      description: "The person's social security number.",
      format: "password",
    }),
    homepage: Yup.string().url().meta({
      title: "Homepage",
      description: "The person's homepage URL.",
      format: "uri",
    }),
    birthday: Yup.date().meta({
      title: "Birthday",
      description: "The person's birthday.",
      format: "date",
    }),
    is_active: Yup.boolean().meta({
      title: "Is Active",
      description:
        "Whether the person is active. This field has a uiSchema of radio and oneOf options, so it will render as a radio input.",
      uiSchema: { component: "radio" },
      oneOf: [
        { title: "Yes", const: true },
        { title: "No", const: false },
      ],
    }),
    loves_cats: Yup.boolean().meta({
      title: "Loves Cats",
      description: "Whether the person loves cats.",
    }),
    loves_dogs: Yup.boolean().meta({
      title: "Loves Dogs",
      description:
        "Whether the person loves dogs. This field has a uiSchema of switch but no oneOf options, so it will default to a checkbox input.",
      uiSchema: { component: "switch" },
    }),
    loves_pizza: Yup.boolean()
      .default(true)
      .meta({
        title: "Loves Pizza",
        description:
          "Whether the person loves pizza. This field has a uiSchema of switch and oneOf options, so it will render as a switch input.",
        uiSchema: { component: "switch" },
        oneOf: [
          { title: "🍕", const: true },
          { title: "🙅‍♂️", const: false },
        ],
      }),
    loves_tacos: Yup.boolean().meta({
      title: "Loves Tacos",
      description:
        "Whether the person loves tacos. This field has oneOf options but no uiSchema defined, so it will default to the checkbox input.",
      oneOf: [
        { title: "🌮", const: true },
        { title: "🙅‍♂️", const: false },
      ],
    }),
    address: addressSchema.meta({
      title: "Address",
      description: "The person's address.",
    }),
    friends: Yup.array().of(friendSchema).min(0).meta({
      title: "Friends",
      description: "A list of the person's friends.",
    }),
    employment: Yup.object()
      .shape({
        employer: Yup.string()
          .required()
          .meta({ title: "Employer", description: "The person's employer." }),
        role: Yup.string()
          .required()
          .meta({ title: "Role", description: "The person's role." }),
        start_date: Yup.date().required().meta({
          title: "Start Date",
          description: "The date the person started the role.",
          format: "date",
        }),
        end_date: Yup.date().meta({
          title: "End Date",
          description: "The date the person ended the role.",
          format: "date",
        }),
        address: addressSchema.meta({
          title: "Address",
          description: "The address of the employment location.",
        }),
      })
      .meta({
        title: "Employment",
        description: "The person's employment details.",
      }),
    projects: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string()
            .required()
            .meta({ title: "Name", description: "The name of the project." }),
          description: Yup.string().required().meta({
            title: "Description",
            description: "The description of the project.",
          }),
          start_date: Yup.date().required().meta({
            title: "Start Date",
            description: "The date the project started.",
            format: "date",
          }),
          end_date: Yup.date().meta({
            title: "End Date",
            description: "The date the project ended.",
            format: "date",
          }),
          team: Yup.array().of(friendSchema).meta({
            title: "Team",
            description: "The team members involved in the project.",
          }),
        })
      )
      .min(0)
      .meta({
        title: "Projects",
        description: "A list of the person's projects.",
      }),
  })
  .meta({
    title: "Example Schema",
    description:
      "A schema representing a complex object with various features.",
  });
