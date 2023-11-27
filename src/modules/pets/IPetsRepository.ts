import { WIPPet, Pet } from './Pets.do';

export interface IPetsRepository {
  create(userId: string, wipPet: WIPPet): Promise<Pet>;
  getAll(): Promise<{ items: Pet[] }>;
  getById(id: string): Promise<Pet>;
  getByUserId(userId: string): Promise<{ items: Pet[] }>;
  update(id: string, wipPet: Partial<WIPPet>): Promise<Pet>;
  delete(id: string): Promise<void>;
}
