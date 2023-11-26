import { Type } from './Type';
import { BaseError } from './BaseError';

export class DatabaseError extends BaseError {
  constructor(message = 'Database error') {
    super(message, Type.DatabaseError);
    this.name = 'DatabaseError';
  }
}
