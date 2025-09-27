


export interface IValdateReactHook {
    required?: true,
    pattern?: RegExp
    minLength?: number
}


export interface IErrorResponse {
  error: {
    details?: {
      errors: {
        message: string;
      }[];
    };
    message?: string;
  };
}