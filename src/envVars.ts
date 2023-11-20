import Bun from 'bun';
import { IConfig } from './config';

class EnvVars implements IConfig {
  public jwtSecret: string;
  public port: number;
  public domainsWhitelist: string[];

  public dbUsername: string;
  public dbPassword: string;
  public dbHost: string;
  public dbPort: number;
  public dbName: string;
  
  public static load(): EnvVars {
    const jwtSecret = Bun.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined');

    const rawPort = Bun.env.PORT;
    if (!rawPort) throw new Error('PORT is not defined');
    const port = parseInt(rawPort);

    const rawDomainsWhitelist = Bun.env.DOMAINS_WHITELIST;
    if (!rawDomainsWhitelist) throw new Error('PORT is not defined');
    const domainsWhitelist = rawDomainsWhitelist.split(',');

    const dbUsername = Bun.env.DB_USERNAME;
    if (!dbUsername) throw new Error('DB_USERNAME is not defined');

    const dbPassword = Bun.env.DB_PASSWORD;
    if (!dbPassword) throw new Error('DB_PASSWORD is not defined');

    const dbHost = Bun.env.DB_HOST;
    if (!dbHost) throw new Error('DB_HOST is not defined');

    const rawDbPort = Bun.env.DB_PORT;
    if (!rawDbPort) throw new Error('DB_PORT is not defined');
    const dbPort = parseInt(rawDbPort);

    const dbName = Bun.env.DB_NAME;
    if (!dbName) throw new Error('DB_NAME is not defined');

    return new EnvVars({
      jwtSecret,
      port,
      domainsWhitelist,
      dbUsername,
      dbPassword,
      dbHost,
      dbPort,
      dbName,
    });
  }

  private constructor({
    jwtSecret,
    port,
    domainsWhitelist,
    dbHost,
    dbUsername,
    dbPassword,
    dbPort,
    dbName,
  }: IConfig) {
    this.jwtSecret = jwtSecret;
    this.port = port;
    this.domainsWhitelist = domainsWhitelist;
    this.dbUsername = dbUsername;
    this.dbPassword = dbPassword;
    this.dbHost = dbHost;
    this.dbPort = dbPort;
    this.dbName = dbName;
  }
}

export default EnvVars;
