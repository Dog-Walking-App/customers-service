import { t } from '../controller';
import { Type } from './Type';
import { BaseError } from './BaseError';

export const unknownErrorStatus = 500;

export class UnknownError extends BaseError {
  constructor(message = 'Unknown error') {
    super(message, Type.Unknown);
    this.name = 'UnknownError';
  }
}

export const UnknownErrorSchema = t.Object({
  message: t.String(),
}, {
  description: 'Internal Server Error',
});
