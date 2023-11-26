import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { bearer } from '@elysiajs/bearer';
import {
  DatabaseError,
  ConflictError, conflictErrorStatus,
  InvalidIdError, invalidIdErrorStatus,
  NotFoundError, notFoundErrorStatus,
  UnauthorizedError, unauthorizedErrorStatus,
  PermissionError, permissionErrorStatus,
  UnknownError, unknownErrorStatus,
  ValidationError, validationErrorStatus,
  Type,
} from '../errors';

export interface IAppPlugin {
  getApp: () => Elysia<string>;
}

interface IConfig {
  domainsWhitelist: string[];
}

interface IApp {
  use(controller: IAppPlugin): IApp;
  listen(port: number, callback: () => void): IApp;
  onStop(callback: () => void): IApp;
}

export class App implements IApp {
  private readonly app: Elysia<'/api', {
    request: {};
    store: {};
  }, {
    type: {};
    error: {
      [Type.Conflict]: ConflictError;
      [Type.DatabaseError]: DatabaseError;
      [Type.InvalidId]: InvalidIdError;
      [Type.NotFound]: NotFoundError;
      [Type.Unauthorized]: UnauthorizedError;
      [Type.Permission]: PermissionError;
      [Type.Unknown]: UnknownError;
      [Type.Validation]: ValidationError;
    };
  }>;

  constructor({
    domainsWhitelist,
  }: IConfig) {
    this.app = new Elysia({ prefix: '/api' })
      .state('data', {})
      .use(swagger())
      .use(cors({
        origin: domainsWhitelist,
        credentials: true,
      }))
      .use(bearer())
      .error({
        [Type.Conflict]: ConflictError,
        [Type.DatabaseError]: DatabaseError,
        [Type.InvalidId]: InvalidIdError,
        [Type.NotFound]: NotFoundError,
        [Type.Unauthorized]: UnauthorizedError,
        [Type.Permission]: PermissionError,
        [Type.Unknown]: UnknownError,
        [Type.Validation]: ValidationError,
      })
      .onError(({ code, error, set }) => {
        switch (code) {
          case Type.Conflict: {
            set.status = conflictErrorStatus;
            return {
              message: error.message,
            };
          }
          case Type.InvalidId: {
            set.status = invalidIdErrorStatus;
            return {
              message: error.message,
            };
          }
          case Type.NotFound: {
            set.status = notFoundErrorStatus;
            return {
              message: error.message,
            };
          }
          case Type.Unauthorized: {
            set.status = unauthorizedErrorStatus;
            return {
              message: error.message,
            };
          }
          case Type.Permission: {
            set.status = permissionErrorStatus;
            return {
              message: error.message,
            };
          }
          case 'PARSE':
          case 'VALIDATION':
          case Type.Validation: {
            set.status = validationErrorStatus;
            return {
              message: error.message,
            };
          }
          case Type.DatabaseError:
          case Type.Unknown:
          default: {
            set.status = unknownErrorStatus;
            return {
              message: 'Internal server error',
            };
          }
        }
      });
  }

  use(controller: IAppPlugin): IApp {
    this.app.use(controller.getApp());

    return this;
  }

  listen(port: number, callback: () => void): IApp {
    this.app.listen(port, callback);

    return this;
  }

  onStop(callback: () => void): IApp {
    this.app.onStop(callback);

    return this;
  }
}
