import { Controller, IAppPlugin, t } from '../../controller';
import { protect, validate, IProtectConfig } from '../../middlewares';
import { ValidationError } from '../../errors';

import { UsersService } from './Users.service';
import { UserDTO, WIPUserDTO } from './Users.dto';
import { Tag } from './tag';

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
        tags: [Tag.Users],
      },
    })
    .post('/', async ({ claims, data }) => {
      const user = await usersService.register(claims, data);

      return UserDTO.fromDO(user).toBody();
    }, {
      beforeHandle: [protectMiddleware, validateWIPUserMiddleware],
      body: WIPUserDTO.toBodySchema(),
      response: {
        200: UserDTO.toResponseSchema(),
      },
      detail: {
        summary: 'Register a user',
        tags: [Tag.Users],
      },
    })
    .put('/:id', async ({ claims, params, data }) => {
      if (!params.id) throw new ValidationError('Id is required');

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
      response: {
        200: UserDTO.toResponseSchema(),
      },
      detail: {
        summary: 'Update current user',
        tags: [Tag.Users],
      },
    });
};

export default getRoutes;
