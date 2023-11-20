import { Handler } from 'elysia';
import { IJWT, BaseClaims } from '../jwt';

export interface IProtectConfig {
  jwt: IJWT;
}

const protect = (
  { jwt }: IProtectConfig,
): Handler<{}, {
  store: { claims: BaseClaims };
  request: { readonly bearer?: string };
}> => (context) => {
  const { bearer, set, store } = context;
  if (!bearer) {
    set.status = 400;
    set.headers[
      'WWW-Authenticate'
    ] = `Bearer realm='sign', error="invalid_request"`;

    throw new Error('Unauthorized');
  } else {
    try {
      const claims = jwt.getClaims(bearer);
      store.claims = claims;
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
