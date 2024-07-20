import { FieldTemplates } from "../types";
import { ArrayDisplay, ArrayFieldset } from "./fieldsetTypeArray";
import { ObjectDisplay, ObjectFieldset } from "./fieldsetTypeObject";
import { BooleanDisplay, BooleanField } from "./fieldTypeBoolean";
import { NumberDisplay, NumberField } from "./fieldTypeNumber";
import { StringDisplay, StringField } from "./fieldTypeString";

export const BaseFieldTemplates: FieldTemplates = {
  StringField: StringField,
  NumberField: NumberField,
  BooleanField: BooleanField,
  ObjectFieldset: ObjectFieldset,
  ArrayFieldset: ArrayFieldset,
  StringDisplay: StringDisplay,
  NumberDisplay: NumberDisplay,
  BooleanDisplay: BooleanDisplay,
  ObjectDisplay: ObjectDisplay,
  ArrayDisplay: ArrayDisplay,
};

export * from "./fieldsetTypeArray";
export * from "./fieldsetTypeObject";
export * from "./fieldTypeBoolean";
export * from "./fieldTypeNumber";
export * from "./fieldTypeString";
export * from "./formRoot";
