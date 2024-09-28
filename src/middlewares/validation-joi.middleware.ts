import Joi from "joi";

export function validationJoiMiddleware(schema: Joi.ObjectSchema<any>) {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Do not stop on the first error, return all errors
      allowUnknown: false, // Disallow fields that are not specified in the schema
      stripUnknown: true, // Remove unknown fields from the request body
      convert: true, // Automatically convert values to the correct types (e.g., string to number)
      errors: {
        wrap: {
          label: "", // Clean field names without quotes in errors
        },
      },
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((d) => d.message) });
    }
    next();
  };
}
