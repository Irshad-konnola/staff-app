import { FieldValues, Resolver } from "react-hook-form";
import { ZodSchema, ZodError } from "zod";

export const zodCustomResolver = <T extends FieldValues>(
  schema: ZodSchema<T>
): Resolver<T> => {
  return async (values) => {
    try {
      // Parse values based on Zod schema
      schema.parse(values);

      return { values, errors: {} };
    } catch (error) {
      const errors: Record<string, any> = {};

      if (error instanceof ZodError) {
        error.errors.forEach((issue) => {
          if (!errors[issue.path[0]]) {
            errors[issue.path[0]] = {
              message: issue.message,
              type: issue.code,
            };
          }
        });
      }

      return { values: {}, errors };
    }
  };
};
