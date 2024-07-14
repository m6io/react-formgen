import { ErrorObject } from "ajv";
import { useFormContext } from "./useFormContext";

// Custom hook to get form errors at a specific path
export const useErrorsAtPath = (path: string[]): ErrorObject[] | undefined => {
  const errors = useFormContext((state) => state.errors);

  const getErrorsAtPath = (path: string[]): ErrorObject[] | undefined => {
    const errorMap: { [key: string]: ErrorObject[] } = {};

    errors?.forEach((error) => {
      const fullPath = error.instancePath
        ? `/${(error.instancePath || "").split("/").slice(1).join("/")}`
        : "/";
      const missingPath =
        error.keyword === "required"
          ? `${fullPath === "/" ? "" : fullPath}/${error.params.missingProperty}`
          : fullPath;
      errorMap[missingPath] = errorMap[missingPath] || [];
      errorMap[missingPath].push(error);
    });

    const fullPath = `/${path.join("/")}`;
    const errorsAtPath = errorMap[fullPath] || [];

    return errorsAtPath;
  };

  return getErrorsAtPath(path);
};
