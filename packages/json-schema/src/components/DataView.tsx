import React from "react";
import { FormProvider } from "./FormProvider";
import { DataDisplayProps } from "./types";
import { BaseDisplayTemplate, BaseFieldTemplates } from "./templates";

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
