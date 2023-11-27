interface IRawPet {
  id: string;
  ownerId: string;
  name: string;
}

export class Pet {
  public id: string;
  public ownerId: string;
  public name: string;

  public constructor(rawPet: IRawPet) {
    this.id = rawPet.id;
    this.ownerId = rawPet.ownerId;
    this.name = rawPet.name;
  }
}

interface IRawWIPPet {
  name: string;
}

export class WIPPet {
  public name: string;

  public constructor(rawPet: IRawWIPPet) {
    this.name = rawPet.name;
  }
}
