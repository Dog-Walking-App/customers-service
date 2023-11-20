export interface IConfig {
  jwtSecret: string;
  port: number;
  domainsWhitelist: string[];

  dbUsername: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
  dbName: string;
}
