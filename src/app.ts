import { IConfig } from './config';
import JWT from './jwt';
import { initDataSource } from './dataSource';
import { App } from './controller';

import { UsersService } from './modules/users/Users.service';
import { UsersRepository } from './modules/users/Users.repository';

import getHealthCheckRoutes from './modules/healthCheck/HealthCheck.controller';
import getUsersRoutes from './modules/users/Users.controller';

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

  new App({ domainsWhitelist })
    .use(getHealthCheckRoutes())
    .use(getUsersRoutes({ usersService, jwt }))
    .listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on port ${port}`);
    })
    .onStop(() => {
      // eslint-disable-next-line no-console
      console.log('Stopping server');
      jwt.dispose();
    });
};
