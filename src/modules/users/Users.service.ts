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
  
  public register(claims: BaseClaims, wipUser: IWIPUser): Promise<IUser> {
    return this.usersRepository.create(claims.sub, wipUser);
  }

  public getMe(claims: BaseClaims): Promise<IUser> {
    return this.usersRepository.getByAccountId(claims.sub);
  }

  public updateMe(claims: BaseClaims, wip: Partial<IWIPUser>): Promise<IUser> {
    return this.usersRepository.updateByAccountId(claims.sub, wip);
  }
}
