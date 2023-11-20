import { Elysia, t } from 'elysia';

import { BaseClaims } from '../../jwt';
import protect, { IProtectConfig } from '../../utils/protect';
import validate from '../../utils/validate';

import { UsersService } from './Users.service';
import { UserDTO, WIPUserDTO } from './Users.dto';

interface IConfig extends IProtectConfig {
  usersService: UsersService;
}

type TElysia = Elysia<
  '',
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store: { claims: BaseClaims; data: any };
    request: { readonly bearer?: string };
  }
>;

const getRoutes = (config: IConfig) => (app: TElysia): TElysia => {
  const { usersService } = config;

  return app.group('/api/v1/users', (app) => app
    .get('/me', async ({ store: { claims } }) => {
      const user = await usersService.getMe(claims);

      return UserDTO.fromDO(user).toBody();
    }, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeHandle: [protect(config) as any],
      detail: {
        summary: 'Get the current user',
        tags: ['users'],
      },
    })
    .post('/me', async ({ store: { claims, data } }) => {
      const user = await usersService.register(claims, data);

      return UserDTO.fromDO(user).toBody();
    }, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeHandle: [protect(config), validate(WIPUserDTO) as any],
      body: t.Object(
        {
          firstName: t.Optional(t.String()),
          lastName: t.Optional(t.String()),
        },
        {
          description: 'Expected an accountId, firstName(optional) and lastName(optional)',
        },
      ),
      detail: {
        summary: 'Register a user',
        tags: ['users'],
      },
    })
    .put('/me', async ({ store: { claims } }) => {
      const user = await usersService.getMe(claims);

      return UserDTO.fromDO(user).toBody();
    }, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeHandle: [protect(config) as any],
      body: t.Object(
        {
          accountId: t.String(),
          firstName: t.Optional(t.String()),
          lastName: t.Optional(t.String()),
        },
        {
          description: 'Expected an accountId, firstName(optional) and lastName(optional)',
        },
      ),
      detail: {
        summary: 'Update a user with given id',
        tags: ['users'],
      },
    }));
};

export default getRoutes;
