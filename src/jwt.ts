import { dlopen, FFIType } from 'bun:ffi';
import { Buffer } from 'buffer';


const {
  symbols: {
    generate,
    get_claims,
    validate,
  },
  close,
} = dlopen(import.meta.resolveSync('../jwt/target/release/libjwt.so'), {
  generate: {
    args: [FFIType.cstring, FFIType.cstring],
    returns: FFIType.cstring,
  },
  get_claims: {
    args: [FFIType.cstring, FFIType.cstring],
    returns: FFIType.cstring,
  },
  validate: {
    args: [FFIType.cstring, FFIType.cstring],
    returns: FFIType.bool,
  },
});


export interface BaseClaims {
  sub: string;
  exp: number;
}

export interface IJWT {
  generate<T extends BaseClaims>(claims: T): string;
  getClaims<T extends BaseClaims>(token: string): T;
  validate(token: string): boolean;
  dispose(): void;
}

class JWT implements IJWT {
  private secret: string;

  public static new(secret: string): JWT {
    return new JWT(secret);
  }

  private constructor(secret: string) {
    this.secret = secret;
  }

  private fromString(str: string): Buffer {
    return Buffer.concat([Buffer.from(str), Buffer.from([0])]);
  }

  public generate<T extends BaseClaims>(claims: T): string {
    return generate(
      this.fromString(this.secret),
      this.fromString(JSON.stringify(claims)),
    ).toString();
  }

  public getClaims<T extends BaseClaims>(token: string): T {
    const result = get_claims(
      this.fromString(this.secret),
      this.fromString(token),
    ).toString();
    const parsed = JSON.parse(result);

    if (parsed.success === false) {
      throw new Error(parsed.error);
    }

    return parsed.data;
  }

  public validate(token: string): boolean {
    if (validate(
      this.fromString(this.secret),
      this.fromString(token),
    )) {
      return true;
    }

    throw new Error('Invalid token');
  }

  public dispose(): void {
    close();
  }
}

export default JWT;
