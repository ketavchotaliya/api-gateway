import express from 'express';
import { CustomRequest, CustomResponse } from '../environment';
import microservice from '../services/microservice';
import gatewayConfig from '../config';
import { createResponse } from '../utils/helper';
import HttpStatus from 'http-status-codes';
export const router = express.Router();

router.get('/health', (req: CustomRequest, res: CustomResponse) => {
  res.status(200).json({ success: true });
});

// Prevent private route accessing from outside
for (let privatePath of gatewayConfig.gateway.url.privatePath) {
  router.all(privatePath, (req: CustomRequest, res: CustomResponse) => {
    createResponse(res, HttpStatus.NOT_FOUND, HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
    return;
  });
}

// Redirect all routes to particular microservice
router.all('/*', (req: CustomRequest, res: CustomResponse) => {
  microservice.callService(req, res);
});

export default router;
