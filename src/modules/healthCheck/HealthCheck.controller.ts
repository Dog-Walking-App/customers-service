import { Controller, IAppPlugin } from '../../controller';

const getController = (): IAppPlugin => {
  return new Controller('/healthcheck')
    .get('/ping', async () => 'pong', {
      detail: {
        summary: 'Ping the server',
        tags: ['healthcheck'],
      },
    });
};

export default getController;
