import Bun from 'bun';

class EnvVars {
  public jwtSecret: string;
  public port: number;
  public domainsWhitelist: string[];
  
  public static load(): EnvVars {
    const jwtSecret = Bun.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined');

    const rawPort = Bun.env.PORT;
    if (!rawPort) throw new Error('PORT is not defined');
    const port = parseInt(rawPort);

    const rawDomainsWhitelist = Bun.env.DOMAINS_WHITELIST;
    if (!rawDomainsWhitelist) throw new Error('PORT is not defined');
    const domainsWhitelist = rawDomainsWhitelist.split(',');

    return new EnvVars({ jwtSecret, port, domainsWhitelist });
  }

  private constructor({
    jwtSecret,
    port,
    domainsWhitelist,
  }: {
    jwtSecret: string;
    port: number;
    domainsWhitelist: string[];
  }) {
    this.jwtSecret = jwtSecret;
    this.port = port;
    this.domainsWhitelist = domainsWhitelist;
  }
}

export default EnvVars;
