import express from 'express';
import { Request, Response } from 'express';
import { microservice, identity } from '../services';
import gatewayConfig from '../config';
import { createResponse } from '../utils/helper';
import HttpStatus from 'http-status-codes';
import rateLimit from 'express-rate-limit';
export const router = express.Router();

/**
 * Create Rules of Rate Limit for Public API
 */
const publicAPI_RateLimit = rateLimit({
  windowMs: gatewayConfig.server.rateLimit.retryAfter * 60 * 1000, // 15 min window
  max: gatewayConfig.server.rateLimit.maximumTry, // start blocking after 10 requests
  message: gatewayConfig.server.rateLimit.message,
});

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true });
});

// Prevent private route accessing from outside
for (let privatePath of gatewayConfig.gateway.url.privatePath) {
  router.all(privatePath, (req: Request, res: Response) => {
    createResponse(res, HttpStatus.NOT_FOUND, HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
  });
}

// Redirect public route directally without any authentication
for (let publicPath of gatewayConfig.gateway.url.publicPath) {
  router.all(publicPath, publicAPI_RateLimit, (req: Request, res: Response) => {
    microservice.callService(req, res);
  });
}

// Redirect all routes to particular microservice
router.all('/*', /*identity.validateAuthToken,*/ (req: Request, res: Response) => {
  microservice.callService(req, res);
});

export default router;
