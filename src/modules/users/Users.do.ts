interface IRawUser {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
}

export class User {
  public id: string;
  public accountId: string;
  public firstName: string;
  public lastName: string;

  public constructor(rawUser: IRawUser) {
    this.id = rawUser.id;
    this.accountId = rawUser.accountId;
    this.firstName = rawUser.firstName;
    this.lastName = rawUser.lastName;
  }
}

interface IRawWIPUser {
  firstName?: string;
  lastName?: string;
}

export class WIPUser {
  public firstName?: string;
  public lastName?: string;

  public constructor(rawUser: IRawWIPUser) {
    this.firstName = rawUser.firstName;
    this.lastName = rawUser.lastName;
  }
}
