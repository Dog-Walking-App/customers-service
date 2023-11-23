import { BaseClaims } from '../../jwt';
import { IUser, IWIPUser } from './Users.do';
import { IUsersRepository } from './Users.repository';

export class UsersService {
  private usersRepository: IUsersRepository;

  public constructor({
    usersRepository,
  }: {
    usersRepository: IUsersRepository;
  }) {
    this.usersRepository = usersRepository;
  }
  
  public async register(claims: BaseClaims, wipUser: IWIPUser): Promise<IUser> {
    try {
      await this.usersRepository.getByAccountId(claims.sub);

      throw new Error('User already exists');
    } catch (error) {
      return this.usersRepository.create(claims.sub, wipUser);
    }
  }

  public getMe(claims: BaseClaims): Promise<IUser> {
    return this.usersRepository.getByAccountId(claims.sub);
  }

  public async update(claims: BaseClaims, id: string, wip: Partial<IWIPUser>): Promise<IUser> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    if (user.id !== id) throw new Error('Not allowed to update other users');

    return this.usersRepository.update(id, wip);
  }
}
