import { CustomResponse } from '../environment';
import got from 'got';
import logger from '../utils/logger';

class Microservice {
  public async callService(req: any, res: CustomResponse) {
    try {
      // prepare service url
      const microserviceUrl: string = req.custom.hostname + req.originalUrl;

      // request header
      const reqHeader: any = {
        logged_in_user_id: 1, //req.custom.logged_in_user_id,
        user_type_id: 1, //req.custom.user_type_id,
        Authorization: req.headers.authorization,
      };

      const apiResponse: any = await got(microserviceUrl, {
        method: req.method,

        body: req.body,
        headers: reqHeader,
      });

      res.setHeader('Content-Type', apiResponse.headers['content-type']);
      return res.status(apiResponse.statusCode).send(apiResponse.body);
    } catch (e) {
      logger.error(__filename, '', 'callService', 'Internal Server error', e);
      res.setHeader('Content-Type', e.headers['content-type']);
      res.status(e.statusCode).send(e.body);
    }
  }
}

export default new Microservice();
