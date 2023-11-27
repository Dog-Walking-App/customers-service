import { BaseClaims } from '../../jwt';
import { NotFoundError } from '../../errors';
import { IUsersRepository } from '../users/IUsersRepository';
import { IPetsRepository } from './IPetsRepository';
import { Pet, WIPPet } from './Pets.do';

export class PetsService {
  private petsRepository: IPetsRepository;
  private usersRepository: IUsersRepository;

  public constructor({
    petsRepository,
    usersRepository,
  }: {
    petsRepository: IPetsRepository;
    usersRepository: IUsersRepository;
  }) {
    this.petsRepository = petsRepository;
    this.usersRepository = usersRepository;
  }
  
  public async registerPet(claims: BaseClaims, wipPet: WIPPet): Promise<Pet> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    return this.petsRepository.create(user.id, wipPet);
  }

  public async getPets(claims: BaseClaims): Promise<{ items: Pet[] }> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    return this.petsRepository.getByUserId(user.id);
  }

  public async updatePet(
    claims: BaseClaims,
    petId: string,
    wip: Partial<WIPPet>,
  ): Promise<Pet> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    const pet = await this.petsRepository.getById(petId);

    if (pet.ownerId !== user.id) throw new NotFoundError('Pet not found');

    return this.petsRepository.update(petId, wip);
  }

  public async deletePet(
    claims: BaseClaims,
    petId: string,
  ): Promise<Pet> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    const pet = await this.petsRepository.getById(petId);

    if (pet.ownerId !== user.id) throw new NotFoundError('Pet not found');

    await this.petsRepository.delete(petId);

    return pet;
  }
}
