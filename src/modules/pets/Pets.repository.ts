import { IWIPPet, IPet } from './Pets.do';
import { Pet } from './Pets.model';
import { DataSource, Repository } from '../../dataSource';

export interface IPetsRepository {
  create(userId: string, wipPet: IWIPPet): Promise<IPet>;
  getAll(): Promise<{ items: IPet[] }>;
  getById(id: string): Promise<IPet>;
  getByUserId(userId: string): Promise<{ items: IPet[] }>;
  update(id: string, wipPet: Partial<IWIPPet>): Promise<IPet>;
  delete(id: string): Promise<void>;
}

export class PetsRepository implements IPetsRepository {
  private repository: Repository<Pet>;
  
  public constructor(dataSource: DataSource) {
    const repository = dataSource.getRepository(Pet);
    this.repository = repository;
  }
  
  public async create(userId: string, wipPet: IWIPPet): Promise<IPet> {
    const pet = new Pet();
    pet.ownerId = userId;
    pet.name = wipPet.name;
    const updatedPet = await this.repository.save(pet);

    return updatedPet.toDO();
  }

  public async getAll(): Promise<{ items: IPet[] }> {
    const pets = await this.repository.find();

    return {
      items: pets.map((pet) => pet.toDO()),
    };
  }

  public async getById(id: string): Promise<IPet> {
    let parsedId: number;
    try {
      parsedId = parseInt(id);
    } catch (error) {
      throw new Error('Invalid id');
    }
    
    const pet = await this.repository.findOneBy({ id: parsedId });
    if (!pet) throw new Error('Pet not found');

    return pet.toDO();
  }

  public async getByUserId(userId: string): Promise<{ items: IPet[] }> {
    const pets = await this.repository.findBy({ ownerId: userId });

    return {
      items: pets.map((pet) => pet.toDO()),
    };
  }

  public async update(id: string, wipPet: Partial<IWIPPet>): Promise<IPet> {
    let parsedId: number;
    try {
      parsedId = parseInt(id);
    } catch (error) {
      throw new Error('Invalid id');
    }

    const pet = await this.repository.findOneBy({ id: parsedId });
    if (!pet) throw new Error('Pet not found');

    pet.name = wipPet.name || pet.name;
    const updatedPet = await this.repository.save(pet);

    return updatedPet.toDO();
  }

  public async delete(id: string): Promise<void> {
    let parsedId: number;
    try {
      parsedId = parseInt(id);
    } catch (error) {
      throw new Error('Invalid id');
    }

    await this.repository.delete({ id: parsedId });
  }
}
