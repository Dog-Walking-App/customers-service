import { t } from '../controller';
import { Type } from './Type';
import { BaseError } from './BaseError';

export const conflictErrorStatus = 409;

export class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, Type.Conflict);
    this.name = 'ConflictError';
  }
}

export const ConflictErrorSchema = t.Object({
  message: t.String(),
}, {
  description: 'Conflict',
});
