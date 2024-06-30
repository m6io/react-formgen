import { CustomFields } from "@m6oss/schema-form";
import { TailwindArrayField } from "./TailwindArrayField";
import { TailwindBooleanField } from "./TailwindBooleanField";
import { TailwindNumberField } from "./TailwindNumberField";
import { TailwindObjectField } from "./TailwindObjectField";
import { TailwindStringField } from "./TailwindStringField";
import { TailwindFormComponent } from "./TailwindFormComponent";

/**
 * Custom Fields Object
 */
const tailwindCustomFields: CustomFields = {
  ArrayField: TailwindArrayField,
  BooleanField: TailwindBooleanField,
  NumberField: TailwindNumberField,
  ObjectField: TailwindObjectField,
  StringField: TailwindStringField,
};

export { tailwindCustomFields, TailwindFormComponent };
