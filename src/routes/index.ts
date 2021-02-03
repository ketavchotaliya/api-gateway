import express from 'express';
import { CustomRequest, CustomResponse } from '../environment';
import microservice from '../services/microservice';
export const router = express.Router();

router.get('/health', (req: CustomRequest, res: CustomResponse) => {
  res.status(200).json({ success: true });
});

// Redirect all routes to particular microservice
router.all('/*', (req: CustomRequest, res: CustomResponse) => {
  microservice.callService(req, res);
});

export default router;
