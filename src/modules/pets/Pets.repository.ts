import { DataSource, Repository } from '../../dataSource';
import { BaseRepository } from '../../repository';
import { NotFoundError } from '../../errors';
import { IPetsRepository } from './IPetsRepository';
import { WIPPet, Pet } from './Pets.do';
import { Pet as PetModel } from './Pets.model';

export class PetsRepository extends BaseRepository implements IPetsRepository {
  private repository: Repository<PetModel>;

  public constructor(dataSource: DataSource) {
    super();
    const repository = dataSource.getRepository(PetModel);
    this.repository = repository;
  }

  public async create(userId: string, wipPet: WIPPet): Promise<Pet> {
    const pet = new PetModel();
    pet.ownerId = userId;
    pet.name = wipPet.name;
    const updatedPet = await this.repository.save(pet);

    return updatedPet.toDO();
  }

  public async getAll(): Promise<{ items: Pet[] }> {
    const pets = await this.repository.find();

    return {
      items: pets.map((pet) => pet.toDO()),
    };
  }

  public async getById(rawId: string): Promise<Pet> {
    const id = this.parseId(rawId);
    
    const pet = await this.repository.findOneBy({ id });
    if (!pet) throw new NotFoundError('Pet not found');

    return pet.toDO();
  }

  public async getByUserId(userId: string): Promise<{ items: Pet[] }> {
    const pets = await this.repository.findBy({ ownerId: userId });

    return {
      items: pets.map((pet) => pet.toDO()),
    };
  }

  public async update(rawId: string, wipPet: Partial<WIPPet>): Promise<Pet> {
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
