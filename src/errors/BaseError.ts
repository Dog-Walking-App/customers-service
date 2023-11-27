import { Type } from './Type';

export class BaseError extends Error {
  private type: Type;

  constructor(message: string, type: Type) {
    super(message);
    this.type = type;
    this.name = 'BaseError';
  }

  public getType(): Type {
    return this.type;
  }
}
