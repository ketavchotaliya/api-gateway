import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

/**
 * @description Create Response
 * @param {Object} res
 * @param {Number} status
 * @param {String} message
 * @param {Object} payload
 * @param {Object} pager
 */
export const createResponse = (
  res: Response,
  status: number,
  message: string,
  payload: object = {},
  pager: object = {}
) => {
  const resPager: object = typeof pager !== 'undefined' ? pager : {};

  return res.status(status).json({
    status,
    message,
    payload,
    pager: resPager
  });
};

/**
 * @description Send Validation Response
 * @param {Object} res
 * @param {errors} errors - Errors Object
 *
 * @return {*|Sequelize.json|Promise<any>}
 */
export const createValidationResponse = (res: Response, errors: any) => {
  return createResponse(
    res,
    HttpStatus.UNPROCESSABLE_ENTITY,
    errors[Object.keys(errors)[0]],
    { error: errors[Object.keys(errors)[0]] },
    {}
  );
};
