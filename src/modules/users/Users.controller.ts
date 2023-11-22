import { Controller, IController } from '../../controller';
import { protect, validate, IProtectConfig } from '../../middlewares';

import { UsersService } from './Users.service';
import { UserDTO, WIPUserDTO } from './Users.dto';

interface IConfig extends IProtectConfig {
  usersService: UsersService;
}

const getRoutes = (config: IConfig): IController => {
  const { usersService } = config;
  const controller = new Controller('/users');

  const protectMiddleware = protect(config);
  const validateWIPUserMiddleware = validate(WIPUserDTO);

  controller
    .get('/me', async ({ claims }) => {
      const user = await usersService.getMe(claims);

      return UserDTO.fromDO(user).toBody();
    }, {
      beforeHandle: [protectMiddleware],
      response: {
        200: UserDTO.toResponseSchema(),
      },
      detail: {
        summary: 'Get the current user',
        tags: ['users'],
      },
    })
    .post('/me', async ({ claims, data }) => {
      const user = await usersService.register(claims, data);

      return UserDTO.fromDO(user).toBody();
    }, {
      beforeHandle: [protectMiddleware, validateWIPUserMiddleware],
      body: WIPUserDTO.toBodySchema(),
      detail: {
        summary: 'Register a user',
        tags: ['users'],
      },
    })
    .put('/me', async ({ claims }) => {
      const user = await usersService.getMe(claims);

      return UserDTO.fromDO(user).toBody();
    }, {
      beforeHandle: [protectMiddleware],
      body: WIPUserDTO.toBodySchema(),
      detail: {
        summary: 'Update current user',
        tags: ['users'],
      },
    });

  return controller;
};

export default getRoutes;
