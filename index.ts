import { bootstrap } from './src/app';
import EnvVars from './src/envVars';

const main = async () => {
  const envVars = EnvVars.load();

  await bootstrap(envVars);
};

void main();
