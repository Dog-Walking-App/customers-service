import { BaseClaims, IJWT } from '../jwt';
import { IContext } from '../controller';

export interface IProtectConfig {
  jwt: IJWT;
}

const protect = (
  { jwt }: IProtectConfig,
) => ({ bearer, set }: IContext): { claims: BaseClaims } => {
  if (!bearer) {
    set.status = 400;
    set.headers[
      'WWW-Authenticate'
    ] = `Bearer realm='sign', error="invalid_request"`;

    throw new Error('Unauthorized');
  } else {
    try {
      const claims = jwt.getClaims(bearer);
      return {
        claims,
      };
    } catch (error) {
      set.status = 400;
      set.headers[
        'WWW-Authenticate'
      ] = `Bearer realm='sign', error="invalid_request"`;

      throw new Error('Unauthorized');
    }
  }
};

export default protect;
