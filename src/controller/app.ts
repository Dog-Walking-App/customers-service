import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { bearer } from '@elysiajs/bearer';

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
  private readonly app: Elysia<'/api'>;

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
      .use(bearer());
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
