import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import JWT from './jwt';

export interface Config {
  jwtSecret: string;
  port: number;
  domainsWhitelist: string[];
}

export const startApp = ({
  jwtSecret,
  port,
  domainsWhitelist,
}: Config): void => {
  const jwt = JWT.new(jwtSecret);

  new Elysia()
    .state('version', 1)
    .state('jwt', jwt)
    .use(swagger())
    .use(cors({
      origin: domainsWhitelist,
      credentials: true,
    }))
    .get('/ping', () => 'pong', {
      detail: {
        summary: 'Ping the server',
        tags: ['healthcheck'],
      },
    })
    .listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on port ${port}`);
    });
};
