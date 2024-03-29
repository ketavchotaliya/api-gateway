import { Request, Response } from 'express';

export {}

declare global {
  namespace Express {
    export interface Request {
      user?: any,
      files?: any,
      custom?: any,
    }

    
    export interface Response {
      body?: any;
    }
  }
}

// declare namespace Environment {
//   /**
//    * Custom request that includes all the types of express Request Object
//    */
//   interface CustomRequest extends Request {
//     user?: any;
//     files?: any;
//     custom?: any;
//   }

//   /**
//    * Custom response that includes all the types of express Response Object
//    */
//   interface CustomResponse extends Response {
//     body?: any;
//   }
// }

// export = Environment;
