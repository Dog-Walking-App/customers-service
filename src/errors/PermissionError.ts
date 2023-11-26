import { t } from '../controller';
import { Type } from './Type';
import { BaseError } from './BaseError';

export const permissionErrorStatus = 403;

export class PermissionError extends BaseError {
  constructor(message = 'Permission denied') {
    super(message, Type.Permission);
    this.name = 'PermissionError';
  }
}

export const PermissionErrorSchema = t.Object({
  message: t.String(),
}, {
  description: 'Permission denied',
});
