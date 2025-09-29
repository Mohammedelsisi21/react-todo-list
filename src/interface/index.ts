


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

export interface ITodo {
  id: number
  title: string
  description: string
}