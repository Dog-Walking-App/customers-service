import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IModel } from '../../model';
import { Pet as PetDO } from './Pets.do';

@Entity()
export class Pet implements IModel<PetDO> {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public ownerId!: string;

  @Column()
  public name!: string;
  
  public toDO(): PetDO {
    return new PetDO({
      id: this.id.toString(),
      ownerId: this.ownerId,
      name: this.name,
    });
  }
}
