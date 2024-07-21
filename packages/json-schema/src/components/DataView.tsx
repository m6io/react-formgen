import React from "react";
import { DataDisplayProps } from "./types";
import { BaseDisplayTemplate, BaseFieldTemplates } from "./templates";
import { FormProvider } from "..";

/**
 * DataDisplay component that renders the data based on the schema.
 * @param {DataDisplayProps} props - The props for the DataDisplay.
 * @returns {JSX.Element} The data display component.
 *
 */
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
