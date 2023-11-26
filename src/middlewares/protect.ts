import { BaseClaims, IJWT } from '../jwt';
import { UnauthorizedError } from '../errors';
import { IContext } from '../controller';

export interface IProtectConfig {
  jwt: IJWT;
}

const protect = (
  { jwt }: IProtectConfig,
) => ({ bearer }: IContext): { claims: BaseClaims } => {
  if (!bearer) {
    throw new UnauthorizedError();
  } else {
    try {
      const claims = jwt.getClaims(bearer);
      return {
        claims,
      };
    } catch (error) {
      throw new UnauthorizedError();
    }
  }
};

export default protect;
