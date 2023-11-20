import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { bearer } from '@elysiajs/bearer';

import { IConfig } from './config';
import JWT from './jwt';
import { initDataSource } from './dataSource';

import { UsersService } from './modules/users/Users.service';
import { UsersRepository } from './modules/users/Users.repository';

import getHealthCheckRoutes from './modules/healthCheck';
import getUsersRoutes from './modules/users';

export const bootstrap = async ({
  jwtSecret,
  port,
  domainsWhitelist,
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbUsername,
}: IConfig): Promise<void> => {
  const jwt = JWT.new(jwtSecret);
  const dataSource = await initDataSource({
    username: dbUsername,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbName,
  });
  const usersRepository = new UsersRepository(dataSource);
  const usersService = new UsersService({
    usersRepository,
  });

  new Elysia()
    .group('/api', (app) => app
      .group('/v1', (app) => app
        .state('version', 1)
        .use(swagger({
          path: '/api/v1/swagger',
        }))
        .use(cors({
          origin: domainsWhitelist,
          credentials: true,
        }))
        .use(getHealthCheckRoutes())
        .use(bearer())
        .use(getUsersRoutes({ usersService, jwt }))
        .listen(port, () => {
          // eslint-disable-next-line no-console
          console.log(`Listening on port ${port}`);
        })
        .onStop(() => {
          // eslint-disable-next-line no-console
          console.log('Stopping server');
          jwt.dispose();
        }),
      ),
    );
};
