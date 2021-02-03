import express from 'express';
import { createServer } from 'http';
import logger from './utils/logger';
import jsyaml from 'js-yaml';
import fs from 'fs';
import { router } from './routes';
import serviceDiscovery from './middleware/serviceDiscovery';

export let gatewayConfig: any;

try {
  // Get gateway config file, or throw exception on error
  gatewayConfig = jsyaml.safeLoad(fs.readFileSync(__dirname + '/../gateway.config.yaml', 'utf8'));
} catch (e) {
  logger.error(__filename, '', '', 'Error during read gateway config file', e);
  process.exit(0);
}

// create an object of express application
export const app: express.Application = express();

const port: string | number = gatewayConfig.server.port || 8585;

// create http server
const server = createServer(app);

// server will lisen on 8585 port
server.listen(port, () => {
  logger.info(__filename, ``, ``, ``, `Server is running on ${port}`);
});

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
