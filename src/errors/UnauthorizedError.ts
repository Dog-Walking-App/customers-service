import { t } from '../controller';
import { Type } from './Type';
import { BaseError } from './BaseError';

export const unauthorizedErrorStatus = 401;

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, Type.Unauthorized);
    this.name = 'UnauthorizedError';
  }
}

export const UnauthorizedErrorSchema = t.Object({
  message: t.String(),
}, {
  description: 'Unauthorized access',
});
