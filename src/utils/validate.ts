import { Handler } from 'elysia';
import { validateOrReject } from 'class-validator';
import { IRequestDTO } from './dto';

const validate = <T extends object>(
  RequestDTO: IRequestDTO<T>,
): Handler<{}, {
  store: { data: T };
  request: {};
}> => async ({ body, store }) => {
  const instance = RequestDTO.fromBody(body);
  try {
    await validateOrReject(instance);
    store.data = instance.toDO();
  } catch (error) {
    throw new Error('Invalid data');
  }
};

export default validate;
