import { Response } from 'express';
import got from 'got';
import logger from '../utils/logger';
import FormData from 'form-data';
import HttpStatus, {getStatusText} from 'http-status-codes';

class Microservice {
  public async callService(req: any, res: Response) {
    try {
      // prepare service url
      const microserviceUrl: string = req.custom.hostname + req.originalUrl;

      // request header
      const reqHeader: any = {
        logged_in_user_id: 1, //req.custom.logged_in_user_id,
        user_type_id: 1, //req.custom.user_type_id,
        Authorization: req.headers.authorization,
      };

      let gotObject: any = {};

      // send urlencoded or application/json data
      if (['application/json', 'application/x-www-form-urlencoded'].includes(req.headers['content-type'])) {
        gotObject = {
          method: req.method,
          json: true,
          body: req.body,
          headers: reqHeader,
        };
      }
      // Send form-data
      else {
        // Create form-data object
        const formData = new FormData();

        // Append request body into form-data
        for (let key in req.body) {
          formData.append(key, req.body[key]);
        }

        // append request files into form-data
        for (let key in req.files) {
          // append single file
          if (!Array.isArray(req.files[key])) {
            formData.append(key, req.files[key].data, req.files[key].name);
          }
          // append array of files (multiple files)
          else {
            for (let i = 0; i < req.files[key].length; i++) {
              formData.append(`${key}[]`, req.files[key][i].data, req.files[key][i].name);
            }
          }
        }

        gotObject = {
          method: req.method,
          body: formData,
          headers: reqHeader,
        };
      }

      const apiResponse: any = await got(microserviceUrl, gotObject);

      res.setHeader('Content-Type', apiResponse.headers['content-type']);
      return res.status(apiResponse.statusCode).send(apiResponse.body);
    } catch (e) {
      logger.error(__filename, '', 'callService', 'Internal Server error', e);
      if(e && e.headers && e.headers['content-types']) {
        res.setHeader('Content-Type', e.headers['content-type']);
      }
      if(e && e.body) {
        res.status(e.statusCode).send(e.body);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
      }
    }
  }
}

export default new Microservice();
