import { IConfig } from './config';
import JWT from './jwt';
import { initDataSource } from './dataSource';
import { App } from './controller';

import { UsersService } from './modules/users/Users.service';
import { UsersRepository } from './modules/users/Users.repository';

import { PetsService } from './modules/pets/Pets.service';
import { PetsRepository } from './modules/pets/Pets.repository';

import getUsersController from './modules/users';
import getPetsController from './modules/pets';

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
  const petsRepository = new PetsRepository(dataSource);
  const petsService = new PetsService({
    petsRepository,
    usersRepository,
  });

  new App({ domainsWhitelist })
    .use(getUsersController({ usersService, jwt }))
    .use(getPetsController({ petsService, jwt }))
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
