import React from "react";
import { DataDisplayProps } from "./types";
import { BaseDisplayTemplate, BaseFieldTemplates, FormProvider } from "..";

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
