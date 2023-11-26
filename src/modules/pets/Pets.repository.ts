import { DataSource, Repository } from '../../dataSource';
import { BaseRepository } from '../../repository';
import { NotFoundError } from '../../errors';
import { IWIPPet, IPet } from './Pets.do';
import { Pet } from './Pets.model';

export interface IPetsRepository {
  create(userId: string, wipPet: IWIPPet): Promise<IPet>;
  getAll(): Promise<{ items: IPet[] }>;
  getById(id: string): Promise<IPet>;
  getByUserId(userId: string): Promise<{ items: IPet[] }>;
  update(id: string, wipPet: Partial<IWIPPet>): Promise<IPet>;
  delete(id: string): Promise<void>;
}

export class PetsRepository extends BaseRepository implements IPetsRepository {
  private repository: Repository<Pet>;

  public constructor(dataSource: DataSource) {
    super();
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

  public async getById(rawId: string): Promise<IPet> {
    const id = this.parseId(rawId);
    
    const pet = await this.repository.findOneBy({ id });
    if (!pet) throw new NotFoundError('Pet not found');

    return pet.toDO();
  }

  public async getByUserId(userId: string): Promise<{ items: IPet[] }> {
    const pets = await this.repository.findBy({ ownerId: userId });

    return {
      items: pets.map((pet) => pet.toDO()),
    };
  }

  public async update(rawId: string, wipPet: Partial<IWIPPet>): Promise<IPet> {
    const id = this.parseId(rawId);

    const pet = await this.repository.findOneBy({ id });
    if (!pet) throw new NotFoundError('Pet not found');

    pet.name = wipPet.name || pet.name;
    const updatedPet = await this.repository.save(pet);

    return updatedPet.toDO();
  }

  public async delete(rawId: string): Promise<void> {
    const id = this.parseId(rawId);

    await this.repository.delete({ id });
  }
}
