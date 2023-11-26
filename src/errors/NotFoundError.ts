import { t } from '../controller';
import { Type } from './Type';
import { BaseError } from './BaseError';

export const notFoundErrorStatus = 404;

export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, Type.NotFound);
    this.name = 'NotFoundError';
  }
}

export const NotFoundErrorSchema = t.Object({
  message: t.String(),
}, {
  description: 'Not found',
});
