import { InvalidIdError } from '../errors';

export class BaseRepository {
  protected parseId(id: string): number {
    const parsedId = Number(id);
    if (isNaN(parsedId)) throw new InvalidIdError();
    return parsedId;
  }
}
