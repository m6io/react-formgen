import React from "react";
import { FormProvider } from "./FormProvider";
import { DataDisplayProps } from "./types";
import { BaseDisplayTemplate, BaseFieldTemplates } from "./templates";

export const DataDisplay: React.FC<DataDisplayProps> = ({
  schema,
  initialData = {},
  fieldTemplates = BaseFieldTemplates,
  displayTemplate: DisplayTemplate = BaseDisplayTemplate,
}) => {
  return (
    <FormProvider schema={schema} initialData={initialData}>
      <DisplayTemplate fieldTemplates={fieldTemplates} />
    </FormProvider>
  );
};
