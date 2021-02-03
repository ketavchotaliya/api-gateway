import { CustomRequest, CustomResponse } from '../environment';
import { NextFunction } from 'express';
import gatewayConfig from '../config';
import HttpStatus from 'http-status-codes';
import { createResponse } from '../utils/helper';

class serviceDiscovery {
  public async findServiceFromRequest(req: CustomRequest, res: CustomResponse, next: NextFunction) {
    // If health route found then skip the gatewayConfig checking
    if (req.path === '/health') {
      next();
    } else {
      // find the first word from req url (i.e. service name);
      const reqUrlServiceName = req.path.split('/')[1];
      let isPredicateMatch = false;
      req.custom = {};
      // match the request URL service name from
      for (const gatewayRoutes of gatewayConfig.cloud.gateway.routes) {
        if (reqUrlServiceName === gatewayRoutes.predicates) {
          isPredicateMatch = true;
          req.custom.hostname = gatewayConfig.cloud.gateway.hostname[reqUrlServiceName];
          req.custom.predicates = gatewayRoutes.predicates;
          break;
        }
      }

      if (!isPredicateMatch) {
        createResponse(res, HttpStatus.NOT_FOUND, HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
        return;
      }
      next();
    }
  }
}

export default new serviceDiscovery();
