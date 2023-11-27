import { WIPUser, User } from './Users.do';

export interface IUsersRepository {
  create(accountId: string, wipUser: WIPUser): Promise<User>;
  getAll(): Promise<{ items: User[] }>;
  getById(id: string): Promise<User>;
  getByAccountId(id: string): Promise<User>;
  update(id: string, wipUser: Partial<WIPUser>): Promise<User>;
  updateByAccountId(accountId: string, wipUser: Partial<WIPUser>): Promise<User>;
}
