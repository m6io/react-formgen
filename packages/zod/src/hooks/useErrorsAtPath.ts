import { z } from "zod";
import { useFormContext } from "..";

// Custom hook to get form errors at a specific path
export const useErrorsAtPath = (path: string[]): z.ZodIssue[] | undefined => {
  const errors = useFormContext((state) => state.errors);

  const getErrorsAtPath = (path: string[]): z.ZodIssue[] | undefined => {
    const errorMap: { [key: string]: z.ZodIssue[] } = {};

    errors?.forEach((error) => {
      const fullPath = error.path.join("/");
      errorMap[fullPath] = errorMap[fullPath] || [];
      errorMap[fullPath].push(error);
    });

    const fullPath = path.join("/");
    const errorsAtPath = errorMap[fullPath] || [];

    return errorsAtPath;
  };

  return getErrorsAtPath(path);
};
