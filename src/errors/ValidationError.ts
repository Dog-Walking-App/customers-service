import { t } from '../controller';
import { Type } from './Type';
import { BaseError } from './BaseError';

export const validationErrorStatus = 400;

export class ValidationError extends BaseError {
  constructor(message = 'Validation failed') {
    super(message, Type.Validation);
    this.name = 'ValidationError';
  }
}

export const ValidationErrorSchema = t.Object({
  message: t.String(),
}, {
  description: 'Validation failed',
});
