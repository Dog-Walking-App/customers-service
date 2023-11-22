import { validateOrReject } from 'class-validator';
import { IRequestDTO, IContext } from '../controller';

const validate = <T extends object>(
  RequestDTO: IRequestDTO<T>,
) => async ({ body }: IContext): Promise<{ data: T }> => {
  const instance = RequestDTO.fromBody(body);
  try {
    await validateOrReject(instance);
    return {
      data: instance.toDO(),
    };
  } catch (error) {
    throw new Error('Invalid data');
  }
};

export default validate;
