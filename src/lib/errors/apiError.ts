export default class ApiError extends Error {
    statusCode: number;
    errors?: string[];
    success: false;
    stack?: string | undefined;
  
    constructor(
      statusCode:number,
      message:string,
      errors?:string[],
      stack?:string
    ) {
      super(message);
  
      this.statusCode = statusCode || 500;
      this.message = message || "Something went wrong";
      if(errors)
        this.errors = errors;
      this.success = false;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  