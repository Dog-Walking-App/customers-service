import { Elysia, Context, t } from 'elysia';
import type { UnionToIntersection } from '../types';
import { BodySchema, ResponseSchema } from './schema';

interface IStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface IRequest {
  readonly bearer?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type IContext = Context<{}, {
  store: IStore;
  request: IRequest;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IHandler = any;

type Handler = (context: IContext) => object | Promise<object>;
  
interface IOptions<T extends Handler> {
  beforeHandle?: T[];
  body?: BodySchema;
  response?: ResponseSchema;
  detail: {
    summary: string;
    tags: string[];
  };
}

type CallbackContextData<T extends Handler> = UnionToIntersection<Awaited<ReturnType<T>>>;

type CallbackContext<T extends Handler> = CallbackContextData<T> & IContext;

type Callback<T extends Handler> = (context: CallbackContext<T>) => Promise<unknown>;

export interface IController {
  get: <T extends Handler>(
    path: string,
    callback: Callback<T>,
    options: IOptions<T>,
  ) => IController;
  post: <T extends Handler>(
    path: string,
    callback: Callback<T>,
    options: IOptions<T>,
  ) => IController;
  put: <T extends Handler>(
    path: string,
    callback: Callback<T>,
    options: IOptions<T>,
  ) => IController;

  getApp: () => Elysia<string>;
}

export class Controller implements IController {
  private app: Elysia<string>;

  public constructor(path: string) {
    const app = new Elysia({ prefix: path });
    this.app = app;
  }

  private handle<T extends Handler>(
    callback: Callback<T>,
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

  private extendResponse(response: ResponseSchema): ResponseSchema {
    return {
      404: t.String({
        description: 'Not found',
      }),
      ...response,
    };
  }
  
  public get<T extends Handler>(
    path: string,
    callback: Callback<T>,
    { beforeHandle = [], response = {}, ...restOptions}: IOptions<T>,
  ): IController {
    this.app.get(path, this.handle(callback), {
      ...restOptions,
      response: this.extendResponse(response),
      beforeHandle: this.extendBeforeHandle(beforeHandle),
    });
    return this;
  }

  public post<T extends Handler>(
    path: string,
    callback: Callback<T>,
    { beforeHandle = [], response = {}, ...restOptions}: IOptions<T>,
  ): IController {
    this.app.post(path, this.handle(callback), {
      ...restOptions,
      response: this.extendResponse(response),
      beforeHandle: this.extendBeforeHandle(beforeHandle),
    });
    return this;
  }

  public put<T extends Handler>(
    path: string,
    callback: Callback<T>,
    { beforeHandle = [], response = {}, ...restOptions}: IOptions<T>,
  ): IController {
    this.app.put(path, this.handle(callback), {
      ...restOptions,
      response: this.extendResponse(response),
      beforeHandle: this.extendBeforeHandle(beforeHandle),
    });
    return this;
  }

  public getApp() {
    return this.app;
  }
}
