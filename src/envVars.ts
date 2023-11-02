import dotenv from 'dotenv';

class EnvVars {
  public jwtSecret: string;
  
  public static load(): EnvVars {
    dotenv.config();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined');

    return new EnvVars({ jwtSecret });
  }

  private constructor({
    jwtSecret,
  }: {
    jwtSecret: string;
  }) {
    this.jwtSecret = jwtSecret;
  }
}

export default EnvVars;
