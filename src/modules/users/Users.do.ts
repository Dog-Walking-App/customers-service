export interface IUser {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
}

export class User implements IUser {
  public id: string;
  public accountId: string;
  public firstName: string;
  public lastName: string;

  public constructor(rawUser: IUser) {
    this.id = rawUser.id;
    this.accountId = rawUser.accountId;
    this.firstName = rawUser.firstName;
    this.lastName = rawUser.lastName;
  }
}

export interface IWIPUser {
  firstName?: string;
  lastName?: string;
}

export class WIPUser implements IWIPUser {
  public firstName?: string;
  public lastName?: string;

  public constructor(rawUser: IWIPUser) {
    this.firstName = rawUser.firstName;
    this.lastName = rawUser.lastName;
  }
}
