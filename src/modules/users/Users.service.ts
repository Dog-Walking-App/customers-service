import { BaseClaims } from '../../jwt';
import { ConflictError, PermissionError } from '../../errors';
import { User, WIPUser } from './Users.do';
import { IUsersRepository } from './IUsersRepository';

export class UsersService {
  private usersRepository: IUsersRepository;

  public constructor({
    usersRepository,
  }: {
    usersRepository: IUsersRepository;
  }) {
    this.usersRepository = usersRepository;
  }

  public async register(claims: BaseClaims, wipUser: WIPUser): Promise<User> {
    try {
      await this.usersRepository.getByAccountId(claims.sub);

      throw new ConflictError('User already exists');
    } catch (error) {
      return this.usersRepository.create(claims.sub, wipUser);
    }
  }

  public getMe(claims: BaseClaims): Promise<User> {
    return this.usersRepository.getByAccountId(claims.sub);
  }

  public async update(claims: BaseClaims, id: string, wip: Partial<WIPUser>): Promise<User> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    if (user.id !== id) throw new PermissionError('Not allowed to update other users');

    return this.usersRepository.update(id, wip);
  }
}
