import { IWIPUser, IUser } from './Users.do';
import { User } from './Users.model';
import { DataSource, Repository } from '../../dataSource';

export interface IUsersRepository {
  create(accountId: string, wipUser: IWIPUser): Promise<IUser>;
  getAll(): Promise<{ items: IUser[] }>;
  getById(id: string): Promise<IUser>;
  getByAccountId(id: string): Promise<IUser>;
  update(id: string, wipUser: Partial<IWIPUser>): Promise<IUser>;
  updateByAccountId(accountId: string, wipUser: Partial<IWIPUser>): Promise<IUser>;
}

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  
  public constructor(dataSource: DataSource) {
    const repository = dataSource.getRepository(User);
    this.repository = repository;
  }
  
  public async create(accountId: string, wipUser: IWIPUser): Promise<IUser> {
    const user = new User();
    user.accountId = accountId;
    user.firstName = wipUser.firstName || '';
    user.lastName = wipUser.lastName || '';
    const updatedUser = await this.repository.save(user);

    return updatedUser.toDO();
  }

  public async getAll(): Promise<{ items: IUser[] }> {
    const users = await this.repository.find();

    return {
      items: users.map((user) => user.toDO()),
    };
  }

  public async getById(id: string): Promise<IUser> {
    let parsedId: number;
    try {
      parsedId = parseInt(id);
    } catch (error) {
      throw new Error('Invalid id');
    }
    
    const user = await this.repository.findOneBy({ id: parsedId });
    if (!user) throw new Error('User not found');

    return user.toDO();
  }

  public async getByAccountId(accountId: string): Promise<IUser> {
    const user = await this.repository.findOneBy({ accountId });
    if (!user) throw new Error('User not found');

    return user.toDO();
  }

  public async update(id: string, wipUser: Partial<IWIPUser>): Promise<IUser> {
    let parsedId: number;
    try {
      parsedId = parseInt(id);
    } catch (error) {
      throw new Error('Invalid id');
    }

    const user = await this.repository.findOneBy({ id: parsedId });
    if (!user) throw new Error('User not found');

    user.firstName = wipUser.firstName || user.firstName;
    user.lastName = wipUser.lastName || user.lastName;
    const updatedUser = await this.repository.save(user);

    return updatedUser.toDO();
  }

  public async updateByAccountId(accountId: string, wipUser: Partial<IWIPUser>): Promise<IUser> {
    const user = await this.repository.findOneBy({ accountId });
    if (!user) throw new Error('User not found');

    user.firstName = wipUser.firstName || user.firstName;
    user.lastName = wipUser.lastName || user.lastName;
    const updatedUser = await this.repository.save(user);

    return updatedUser.toDO();
  }
}
