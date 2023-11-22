import { Controller, IController } from '../../controller';

const getController = (): IController => {
  const controller = new Controller('/healthcheck');

  return controller
    .get('/ping', async () => 'pong', {
      detail: {
        summary: 'Ping the server',
        tags: ['healthcheck'],
      },
    });
};

export default getController;
