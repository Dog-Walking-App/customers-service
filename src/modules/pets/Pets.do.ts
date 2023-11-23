export interface IPet {
  id: string;
  ownerId: string;
  name: string;
}

export class Pet implements IPet {
  public id: string;
  public ownerId: string;
  public name: string;

  public constructor(rawPet: IPet) {
    this.id = rawPet.id;
    this.ownerId = rawPet.ownerId;
    this.name = rawPet.name;
  }
}

export interface IWIPPet {
  name: string;
}

export class WIPPet implements IWIPPet {
  public name: string;

  public constructor(rawPet: IWIPPet) {
    this.name = rawPet.name;
  }
}
