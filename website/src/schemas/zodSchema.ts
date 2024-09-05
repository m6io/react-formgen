import { z } from "zod";

export const zodSchema = z
  .object({
    firstName: z
      .string()
      .regex(new RegExp("^[A-Za-z]+$"))
      .min(1)
      .max(100)
      .describe("The person's name."),
    lastName: z
      .string()
      .regex(new RegExp("^[A-Za-z]+$"))
      .min(1)
      .max(100)
      .describe("The person's last name."),
    age: z
      .number()
      .int()
      .gte(0)
      .lte(150)
      .describe("The person's age.")
      .optional(),
    email: z.string().email().describe("The person's email address."),
    phone: z.string().describe("The person's phone number.").optional(),
    ssn: z.string().describe("The person's social security number.").optional(),
    homepage: z
      .string()
      .url()
      .describe("The person's homepage URL.")
      .optional(),
    birthday: z.string().describe("The person's birthday.").optional(),
    is_active: z
      .boolean()
      .describe("Whether the person is active.")
      .superRefine((val, ctx) => {
        if (val !== true && val !== false) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Value must be either true (Yes) or false (No).",
          });
        }
      })
      .optional(),

    loves_cats: z
      .boolean()
      .describe("Whether the person loves cats.")
      .optional(),
    loves_dogs: z
      .boolean()
      .describe("Whether the person loves dogs.")
      .optional(),
    loves_pizza: z
      .boolean()
      .describe("Whether the person loves pizza.")
      .superRefine((val, ctx) => {
        if (val !== true && val !== false) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Value must be either true (🍕) or false (🙅‍♂️).",
          });
        }
      })
      .default(true)
      .optional(),

    loves_tacos: z
      .boolean()
      .describe("Whether the person loves tacos.")
      .superRefine((val, ctx) => {
        if (val !== true && val !== false) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Value must be either true (🌮) or false (🙅‍♂️).",
          });
        }
      })
      .optional(),

    address: z
      .object({
        street_address: z.string().describe("The street address."),
        city: z.string().describe("The city."),
        // TODO: Generating enum-based inputs not yet supported
        state: z
          .enum([
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
          .describe(
            "The state. This field has an enum, so it will render as a select input."
          ),
        notes: z
          .string()
          .describe("Additional notes about the address.")
          .optional(),
      })
      .describe("An object representing an address.")
      .optional(),
    friends: z
      .array(
        z
          .object({
            name: z.string().describe("The friend's name."),
            age: z
              .number()
              .int()
              .gte(0)
              .lte(150)
              .describe("The friend's age.")
              .optional(),
            address: z
              .object({
                street_address: z.string().describe("The street address."),
                city: z.string().describe("The city."),
                // TODO: Generating enum-based inputs not yet supported
                state: z
                  .enum([
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
                  .describe(
                    "The state. This field has an enum, so it will render as a select input."
                  ),
                notes: z
                  .string()
                  .describe("Additional notes about the address.")
                  .optional(),
              })
              .describe("An object representing an address.")
              .optional(),
          })
          .describe("An object representing a friend.")
      )
      .min(0)
      .describe("A list of the person's friends.")
      .optional(),
    employment: z
      .object({
        employer: z.string().describe("The person's employer."),
        role: z.string().describe("The person's role."),
        start_date: z
          .string()
          .describe("The date the person started the role."),
        end_date: z
          .string()
          .describe("The date the person ended the role.")
          .optional(),
        address: z
          .object({
            street_address: z.string().describe("The street address."),
            city: z.string().describe("The city."),
            // TODO: Generating enum-based inputs not yet supported
            state: z
              .enum([
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
              .describe(
                "The state. This field has an enum, so it will render as a select input."
              ),
            notes: z
              .string()
              .describe("Additional notes about the address.")
              .optional(),
          })
          .describe("An object representing an address.")
          .optional(),
      })
      .describe("The person's employment details.")
      .optional(),
    projects: z
      .array(
        z
          .object({
            name: z.string().describe("The name of the project."),
            description: z.string().describe("The description of the project."),
            start_date: z.string().describe("The date the project started."),
            end_date: z
              .string()
              .describe("The date the project ended.")
              .optional(),
            team: z
              .array(
                z
                  .object({
                    name: z.string().describe("The friend's name."),
                    age: z
                      .number()
                      .int()
                      .gte(0)
                      .lte(150)
                      .describe("The friend's age.")
                      .optional(),
                    address: z
                      .object({
                        street_address: z
                          .string()
                          .describe("The street address."),
                        city: z.string().describe("The city."),
                        // TODO: Generating enum-based inputs not yet supported
                        state: z
                          .enum([
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
                          .describe(
                            "The state. This field has an enum, so it will render as a select input."
                          ),
                        notes: z
                          .string()
                          .describe("Additional notes about the address.")
                          .optional(),
                      })
                      .describe("An object representing an address.")
                      .optional(),
                  })
                  .describe("An object representing a friend.")
              )
              .describe("The team members involved in the project.")
              .optional(),
          })
          .describe("An object representing a project.")
      )
      .min(0)
      .describe("A list of the person's projects.")
      .optional(),
  })
  .describe("A schema representing a complex object with various features.");

export const zodSchemaBasic = z.object({
  firstName: z
    .string()
    .regex(new RegExp("^[A-Za-z]+$"))
    .min(1)
    .max(100)
    .describe("The person's first name."),
  lastName: z
    .string()
    .regex(new RegExp("^[A-Za-z]+$"))
    .min(1)
    .max(100)
    .describe("The person's last name."),
  age: z
    .number()
    .int()
    .gte(0)
    .lte(150)
    .describe("The person's age.")
    .optional(),
  email: z.string().email().describe("The person's email address."),
});
