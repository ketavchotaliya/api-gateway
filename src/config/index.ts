import jsyaml from 'js-yaml';
import fs from 'fs';

// Get gateway config file, or throw exception on error
const gatewayConfig = jsyaml.safeLoad(fs.readFileSync(__dirname + '/../../gateway.config.yaml', 'utf8'));

export default gatewayConfig;
