import { startApp } from './src/app';
import EnvVars from './src/envVars';

const main = async () => {
  const envVars = EnvVars.load();

  await startApp({
    jwtSecret: envVars.jwtSecret,
    port: envVars.port,
    domainsWhitelist: envVars.domainsWhitelist,
  });
};

void main();
