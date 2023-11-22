import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IModel } from '../../model';
import { IUser, User as UserDO } from './Users.do';

@Entity()
export class User implements IModel<IUser> {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public accountId!: string;

  @Column()
  public firstName!: string;
  
  @Column()
  public lastName!: string;

  public toDO(): IUser {
    return new UserDO({
      id: this.id.toString(),
      accountId: this.accountId,
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }
}
