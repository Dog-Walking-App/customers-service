import { t } from 'elysia';
import { IsOptional } from 'class-validator';
import { User, WIPUser } from './Users.do';
import {
  IRequestInstanceDTO, IRequestDTO,
  IResponseInstanceDTO, IResponseDTO,
} from '../../controller/dto';
import { IBodySchema, IResponseSchema } from '../../controller/schema';

interface IRawUserDTO {
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
  
  public static fromDO(user: User): UserDTOClass {
    return new UserDTOClass({
      id: user.id,
      accountId: user.accountId,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  private constructor(user: IRawUserDTO) {
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

export const UserDTO: IResponseDTO<User> & IResponseSchema = UserDTOClass;


interface IWIPUserDTO {
  firstName?: string;
  lastName?: string;
}

class WIPUserDTOClass implements IRequestInstanceDTO<WIPUser> {
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

  public toDO(): WIPUser {
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

export const WIPUserDTO: IRequestDTO<WIPUser> & IBodySchema = WIPUserDTOClass;
