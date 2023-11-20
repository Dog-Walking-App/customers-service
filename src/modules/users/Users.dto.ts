import { IsOptional } from 'class-validator';
import { IUser, IWIPUser, WIPUser } from './Users.do';
import {
  IRequestInstanceDTO, IRequestDTO,
  IResponseInstanceDTO, IResponseDTO,
} from '../../utils/dto';

interface IUserDTO {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
}

class UserDTOClass implements IResponseInstanceDTO {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  
  public static fromDO(rawUser: IUser): UserDTOClass {
    return new UserDTOClass({
      id: rawUser.id,
      accountId: rawUser.accountId,
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
    });
  }

  private constructor(user: IUserDTO) {
    this.id = user.id;
    this.accountId = user.accountId;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  public toBody(): unknown {
    return {
      id: this.id,
      accountId: this.accountId,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}

export const UserDTO: IResponseDTO<IUser> = UserDTOClass;


interface IWIPUserDTO {
  firstName?: string;
  lastName?: string;
}

class WIPUserDTOClass implements IRequestInstanceDTO<IWIPUser> {
  @IsOptional()
  public firstName?: string;

  @IsOptional()
  public lastName?: string;

  public static fromBody(body: unknown): WIPUserDTOClass {
    return new WIPUserDTOClass(body as IWIPUserDTO);
  }
  
  private constructor(wipUser: IWIPUserDTO) {
    this.firstName = wipUser.firstName;
    this.lastName = wipUser.lastName;
  }

  public toDO(): IWIPUser {
    return new WIPUser({
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }
}

export const WIPUserDTO: IRequestDTO<IWIPUser> = WIPUserDTOClass;
