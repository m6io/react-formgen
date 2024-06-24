import { CustomFields } from "@m6oss/schema-form";
import { TailwindArrayField } from "./TailwindArrayField";
import { TailwindBooleanField } from "./TailwindBooleanField";
import { TailwindNumberField } from "./TailwindNumberField";
import { TailwindObjectField } from "./TailwindObjectField";
import { TailwindTextField } from "./TailwindTextField";
import { TailwindFormComponent } from "./TailwindFormComponent";

/**
 * Custom Fields Object
 */
const tailwindCustomFields: CustomFields = {
  ArrayField: TailwindArrayField,
  BooleanField: TailwindBooleanField,
  NumberField: TailwindNumberField,
  ObjectField: TailwindObjectField,
  TextField: TailwindTextField,
};

export { tailwindCustomFields, TailwindFormComponent };
