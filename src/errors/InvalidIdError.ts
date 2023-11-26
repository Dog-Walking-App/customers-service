import { t } from '../controller';
import { Type } from './Type';
import { BaseError } from './BaseError';

export const invalidIdErrorStatus = 400;

export class InvalidIdError extends BaseError {
  constructor(message = 'Invalid id') {
    super(message, Type.InvalidId);
    this.name = 'InvalidIdError';
  }
}

export const InvalidIdErrorSchema = t.Object({
  message: t.String(),
}, {
  description: 'Invalid id',
});
