import express from 'express';
import { createServer } from 'http';
import logger from './utils/logger';
import { router } from './routes';
import serviceDiscovery from './middleware/serviceDiscovery';
import gatewayConfig from './config';
import fileUpload from 'express-fileupload';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import HttpStatus from 'http-status-codes';

// create an object of express application
export const app: express.Application = express();

const port: string | number = gatewayConfig.server.port || 8585;

// create http server
const server = createServer(app);

// server will lisen on 8585 port
server.listen(port, () => {
  logger.info(__filename, ``, ``, ``, `Server is running on ${port}`);
});

// initialize cors worh App Object
const corsOptions = {
  origin: ['http://google.com'], //['http://abc.com', 'http://def.com']
  optionsSuccessStatus: HttpStatus.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
  exposedHeaders: ['x-auth'], // ['Origin', 'Content-Type', 'Authorization']
  credentials: true,
};
app.use(cors(corsOptions));

// initialize experss-fileupload with app
app.use(fileUpload());

// initialize body parser with app
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// find service from request URL
app.use(serviceDiscovery.findServiceFromRequest);

app.use(router);

// function for error handler
function exitHandler() {
  server.close(() => {
    logger.warn(__filename, 'Server', '', `Gateway shut down gracefully`, '');
    process.exit(0);
  });
}

// possible node js events
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  (process as NodeJS.EventEmitter).on(eventType, exitHandler.bind(null, eventType));
});
