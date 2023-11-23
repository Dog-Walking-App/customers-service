import { t } from 'elysia';
import { IsOptional } from 'class-validator';
import { IUser, IWIPUser, WIPUser } from './Users.do';
import {
  IRequestInstanceDTO, IRequestDTO,
  IResponseInstanceDTO, IResponseDTO,
} from '../../controller/dto';
import { IBodySchema, IResponseSchema } from '../../controller/schema';

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

  public static toResponseSchema() {
    return t.Object({
      id: t.String(),
      accountId: t.String(),
      firstName: t.String(),
      lastName: t.String(),
    }, {
      description: 'Current user',
    });
  }
}

export const UserDTO: IResponseDTO<IUser> & IResponseSchema = UserDTOClass;


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

  public static toBodySchema() {
    return t.Object({
      firstName: t.Optional(t.String()),
      lastName: t.Optional(t.String()),
    }, {
      description: 'Expected firstName(optional) and lastName(optional)',
    });
  }
}

export const WIPUserDTO: IRequestDTO<IWIPUser> & IBodySchema = WIPUserDTOClass;
