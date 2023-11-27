import { DataSource, Repository } from '../../dataSource';
import { BaseRepository } from '../../repository';
import { NotFoundError } from '../../errors';
import { IUsersRepository } from './IUsersRepository';
import { WIPUser, User } from './Users.do';
import { User as UserModel } from './Users.model';

export class UsersRepository extends BaseRepository implements IUsersRepository {
  private repository: Repository<UserModel>;

  public constructor(dataSource: DataSource) {
    super();
    const repository = dataSource.getRepository(UserModel);
    this.repository = repository;
  }

  public async create(accountId: string, wipUser: WIPUser): Promise<User> {
    const user = new UserModel();
    user.accountId = accountId;
    user.firstName = wipUser.firstName || '';
    user.lastName = wipUser.lastName || '';
    const updatedUser = await this.repository.save(user);

    return updatedUser.toDO();
  }

  public async getAll(): Promise<{ items: User[] }> {
    const users = await this.repository.find();

    return {
      items: users.map((user) => user.toDO()),
    };
  }

  public async getById(rawId: string): Promise<User> {
    const id = this.parseId(rawId);

    const user = await this.repository.findOneBy({ id });
    if (!user) throw new NotFoundError('User not found');

    return user.toDO();
  }

  public async getByAccountId(accountId: string): Promise<User> {
    const user = await this.repository.findOneBy({ accountId });
    if (!user) throw new NotFoundError('User not found');

    return user.toDO();
  }

  public async update(rawId: string, wipUser: Partial<WIPUser>): Promise<User> {
    const id = this.parseId(rawId);

    const user = await this.repository.findOneBy({ id });
    if (!user) throw new NotFoundError('User not found');

    user.firstName = wipUser.firstName || user.firstName;
    user.lastName = wipUser.lastName || user.lastName;
    const updatedUser = await this.repository.save(user);

    return updatedUser.toDO();
  }

  public async updateByAccountId(accountId: string, wipUser: Partial<WIPUser>): Promise<User> {
    const user = await this.repository.findOneBy({ accountId });
    if (!user) throw new NotFoundError('User not found');

    user.firstName = wipUser.firstName || user.firstName;
    user.lastName = wipUser.lastName || user.lastName;
    const updatedUser = await this.repository.save(user);

    return updatedUser.toDO();
  }
}
