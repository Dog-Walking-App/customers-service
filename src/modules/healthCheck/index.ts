import { Elysia } from 'elysia';

const getRoutes = () => (app: Elysia): Elysia => {
  return app.group('/api/v1/healthcheck', (app) => app
    .get('/ping', () => 'pong', {
      detail: {
        summary: 'Ping the server',
        tags: ['healthcheck'],
      },
    }));
};

export default getRoutes;
