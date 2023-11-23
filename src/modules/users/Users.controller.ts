import { Controller, IAppPlugin, t } from '../../controller';
import { protect, validate, IProtectConfig } from '../../middlewares';

import { UsersService } from './Users.service';
import { UserDTO, WIPUserDTO } from './Users.dto';

interface IConfig extends IProtectConfig {
  usersService: UsersService;
}

const getRoutes = (config: IConfig): IAppPlugin => {
  const { usersService } = config;

  const protectMiddleware = protect(config);
  const validateWIPUserMiddleware = validate(WIPUserDTO);

  return new Controller('/users')
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
    .post('/', async ({ claims, data }) => {
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
    .put('/:id', async ({ claims, params, data }) => {
      if (!params.id) throw new Error('Id is required');

      const user = await usersService.update(
        claims,
        params.id,
        data,
      );

      return UserDTO.fromDO(user).toBody();
    }, {
      beforeHandle: [protectMiddleware, validateWIPUserMiddleware],
      params: t.Object({
        id: t.String(),
      }),
      body: WIPUserDTO.toBodySchema(),
      detail: {
        summary: 'Update current user',
        tags: ['users'],
      },
    });
};

export default getRoutes;
