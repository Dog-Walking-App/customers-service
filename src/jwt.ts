import ffi from 'ffi-napi';
import ref from 'ref-napi';
import RefStructDI from 'ref-struct-di';

const Struct = RefStructDI(ref)

const FfiResult = Struct({
  'success': 'bool',
  'data': 'string',
  'error': 'string',
});

const {
  generate,
  get_claims,
  validate,
} = ffi.Library('./jwt/target/release/libjwt.so', {
  'generate': ['string', ['string', 'string']],
  'get_claims': [FfiResult, ['string', 'string']],
  'validate': ['bool', ['string', 'string']],
});


export interface BaseClaims {
  sub: string;
  exp: number;
}

class JWT {
  private secret: string;

  public static new(secret: string): JWT {
    return new JWT(secret);
  }
  
  private constructor(secret: string) {
    this.secret = secret;
  }

  public generate<T extends BaseClaims>(claims: T): string {
    return generate(this.secret, JSON.stringify(claims)) as string;
  }

  public getClaims<T extends BaseClaims>(token: string): T {
    const result = get_claims(this.secret, token);

    if (result.success === false) {
      throw new Error(result.error as string);
    }
    
    return JSON.parse(result.data as string);
  }

  public validate(token: string): boolean {
    if (validate(this.secret, token)) {
      return true;
    }

    throw new Error('Invalid token');
  }
}

export default JWT;
