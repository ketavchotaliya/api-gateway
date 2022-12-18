import { Request, Response } from 'express';
import { isEmpty } from '../utils/validator';
import { NextFunction } from 'express';
import { createValidationResponse } from '../utils/helper';

class Identity {
  public async validateAuthToken(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const errors: any = {};

    if (isEmpty(authorization)) {
      errors.authorization = 'Authorization token is required';
    }

    if (Object.keys(errors).length > 0) {
      createValidationResponse(res, errors);
    } else {
      next();
    }
  }
}

export default new Identity();
