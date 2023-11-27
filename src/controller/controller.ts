import { Elysia, Context } from 'elysia';
import type { UnionToIntersection } from '../types';
import {
  PermissionErrorSchema, permissionErrorStatus,
  UnauthorizedErrorSchema, unauthorizedErrorStatus,
  UnknownErrorSchema, unknownErrorStatus,
  NotFoundErrorSchema, notFoundErrorStatus,
  ValidationErrorSchema, validationErrorStatus,
} from '../errors';
import { ParamsSchema, BodySchema, ResponseSchema } from './schema';
import { IAppPlugin } from './app';

interface IStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface IRequest {
  readonly bearer?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type IContext = Context<NonNullable<unknown>, {
  store: IStore;
  request: IRequest;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IHandler = any;

type Handler = (context: IContext) => object | Promise<object>;

interface IOptions<T extends Handler> {
  beforeHandle?: T[];
  params?: ParamsSchema;
  body?: BodySchema;
  response?: ResponseSchema;
  detail: {
    summary: string;
    tags: string[];
  };
}

type CallbackContextData<
  T extends Handler = Handler,
> = UnionToIntersection<Awaited<ReturnType<T>>>;

type CallbackContext<
  P extends object = Record<string, string | undefined>,
  T extends Handler = Handler,
> = CallbackContextData<T> & { params: P } & Omit<IContext, 'params'>;

type Callback<
  P extends object = Record<string, string | undefined>,
  T extends Handler = Handler,
> = (context: CallbackContext<P, T>) => Promise<unknown>;

export class Controller implements IAppPlugin {
  private app: Elysia<string>;

  public constructor(path: string) {
    const app = new Elysia({ prefix: path });
    this.app = app;
  }

  private handle<
    P extends object = Record<string, string | undefined>,
    T extends Handler = Handler,
  >(
    callback: Callback<P, T>,
  ): (context: IContext) => Promise<unknown> {
    return (context) => {
      const { data } = (context.store as { data: CallbackContextData<T> });
      return callback(Object.assign({}, context, data));
    };
  }

  private extendBeforeHandle<T extends Handler>(
    beforeHandle: T[],
  ): IHandler[] {
    return beforeHandle.map((handle) => {
      return async (context: IContext) => {
        const result = await handle(context);
        Object.entries(result).forEach(([key, value]) => {
          (context.store).data[key] = value;
        });
      };
    });
  }

  private extendResponse(response: ResponseSchema, {
    params = false,
    body = false,
  }: {
    params?: boolean;
    body?: boolean;
  } = {}): ResponseSchema {
    let extendedResponse: ResponseSchema = {
      [permissionErrorStatus]: PermissionErrorSchema,
      [unauthorizedErrorStatus]: UnauthorizedErrorSchema,
      [unknownErrorStatus]: UnknownErrorSchema,
      ...response,
    };

    if (params) {
      extendedResponse = {
        ...extendedResponse,
        [notFoundErrorStatus]: NotFoundErrorSchema,
      };
    }
    if (body) {
      extendedResponse = {
        ...extendedResponse,
        [validationErrorStatus]: ValidationErrorSchema,
      };
    }

    return extendedResponse;
  }

  public get<P extends object = Record<string, string | undefined>, T extends Handler = Handler>(
    path: string,
    callback: Callback<P, T>,
    { beforeHandle = [], response = {}, ...restOptions}: IOptions<T>,
  ): Controller {
    this.app.get(path, this.handle(callback), {
      ...restOptions,
      response: this.extendResponse(response, {
        params: !!restOptions.params,
        body: !!restOptions.body,
      }),
      beforeHandle: this.extendBeforeHandle(beforeHandle),
    });
    return this;
  }

  public post<P extends object = Record<string, string | undefined>, T extends Handler = Handler>(
    path: string,
    callback: Callback<P, T>,
    { beforeHandle = [], response = {}, ...restOptions}: IOptions<T>,
  ): Controller {
    this.app.post(path, this.handle(callback), {
      ...restOptions,
      response: this.extendResponse(response, {
        params: !!restOptions.params,
        body: !!restOptions.body,
      }),
      beforeHandle: this.extendBeforeHandle(beforeHandle),
    });
    return this;
  }

  public put<P extends object = Record<string, string | undefined>, T extends Handler = Handler>(
    path: string,
    callback: Callback<P, T>,
    { beforeHandle = [], response = {}, ...restOptions}: IOptions<T>,
  ): Controller {
    this.app.put(path, this.handle(callback), {
      ...restOptions,
      response: this.extendResponse(response, {
        params: !!restOptions.params,
        body: !!restOptions.body,
      }),
      beforeHandle: this.extendBeforeHandle(beforeHandle),
    });
    return this;
  }

  public delete<P extends object = Record<string, string | undefined>, T extends Handler = Handler>(
    path: string,
    callback: Callback<P, T>,
    { beforeHandle = [], response = {}, ...restOptions}: IOptions<T>,
  ): Controller {
    this.app.delete(path, this.handle(callback), {
      ...restOptions,
      response: this.extendResponse(response, {
        params: !!restOptions.params,
        body: !!restOptions.body,
      }),
      beforeHandle: this.extendBeforeHandle(beforeHandle),
    });
    return this;
  }

  public getApp() {
    return this.app;
  }
}
