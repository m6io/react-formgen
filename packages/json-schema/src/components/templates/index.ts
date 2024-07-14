import { FieldTemplates } from "@/components/types";
import { ArrayFieldset } from "./fieldsetTypeArray";
import { ObjectFieldset } from "./fieldsetTypeObject";
import { BooleanField } from "./fieldTypeBoolean";
import { NumberField } from "./fieldTypeNumber";
import { StringField } from "./fieldTypeString";

export const BaseFieldTemplates: FieldTemplates = {
  ArrayFieldset: ArrayFieldset,
  ObjectFieldset: ObjectFieldset,
  BooleanField: BooleanField,
  NumberField: NumberField,
  StringField: StringField,
};

export * from "./fieldsetTypeArray";
export * from "./fieldsetTypeObject";
export * from "./fieldTypeBoolean";
export * from "./fieldTypeNumber";
export * from "./fieldTypeString";
export * from "./formRoot";
