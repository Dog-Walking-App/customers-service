import { BaseClaims } from '../../jwt';
import { IUsersRepository } from '../users/Users.repository';
import { IPet, IWIPPet } from './Pets.do';
import { IPetsRepository } from './Pets.repository';

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
  
  public async registerPet(claims: BaseClaims, wipPet: IWIPPet): Promise<IPet> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    return this.petsRepository.create(user.id, wipPet);
  }

  public async getPets(claims: BaseClaims): Promise<{ items: IPet[] }> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    return this.petsRepository.getByUserId(user.id);
  }

  public async updatePet(
    claims: BaseClaims,
    petId: string,
    wip: Partial<IWIPPet>,
  ): Promise<IPet> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    const pet = await this.petsRepository.getById(petId);

    if (pet.ownerId !== user.id) throw new Error('Pet not found');

    return this.petsRepository.update(petId, wip);
  }

  public async deletePet(
    claims: BaseClaims,
    petId: string,
  ): Promise<IPet> {
    const user = await this.usersRepository.getByAccountId(claims.sub);
    const pet = await this.petsRepository.getById(petId);

    if (pet.ownerId !== user.id) throw new Error('Pet not found');

    await this.petsRepository.delete(petId);

    return pet;
  }
}
