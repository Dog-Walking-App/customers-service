import { DataSource } from 'typeorm';

export type { DataSource, Repository } from 'typeorm';

interface Config {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export const initDataSource = async ({
  username,
  password,
  host,
  port,
  database,
}: Config): Promise<DataSource> => {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [
      'src/modules/**/*.model.ts',
    ],
    migrations: [
      'src/migration/**/*.ts',
    ],
    synchronize: true,
  });

  try {
    const dataSource = await AppDataSource.initialize();
    // eslint-disable-next-line no-console
    console.log("Data Source has been initialized!");
    return dataSource;
  } catch (error) {
    throw new Error("Exiting due to database connection error", {
      cause: error,
    });
  }
};
