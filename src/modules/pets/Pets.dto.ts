import { t } from 'elysia';
import { IPet, IWIPPet, WIPPet } from './Pets.do';
import {
  IRequestInstanceDTO, IRequestDTO,
  IResponseInstanceDTO, IResponseDTO,
} from '../../controller/dto';
import { IBodySchema, IResponseSchema } from '../../controller/schema';

interface IPetDTO {
  id: string;
  ownerId: string;
  name: string;
}

class PetDTOClass implements IResponseInstanceDTO {
  id: string;
  ownerId: string;
  name: string;
  
  public static fromDO(rawPet: IPet): PetDTOClass {
    return new PetDTOClass({
      id: rawPet.id,
      ownerId: rawPet.ownerId,
      name: rawPet.name,
    });
  }

  private constructor(user: IPetDTO) {
    this.id = user.id;
    this.ownerId = user.ownerId;
    this.name = user.name;
  }

  public toBody(): unknown {
    return {
      id: this.id,
      ownerId: this.ownerId,
      name: this.name,
    };
  }

  public static toResponseSchema() {
    return t.Object({
      id: t.String(),
      ownerId: t.String(),
      name: t.String(),
    }, {
      description: 'Pet',
    });
  }
}

export const PetDTO: IResponseDTO<IPet> & IResponseSchema = PetDTOClass;


interface IWIPPetDTO {
  name: string;
}

class WIPPetDTOClass implements IRequestInstanceDTO<IWIPPet> {
  public name: string;

  public static fromBody(body: unknown): WIPPetDTOClass {
    return new WIPPetDTOClass(body as IWIPPetDTO);
  }
  
  private constructor(wipPet: IWIPPetDTO) {
    this.name = wipPet.name;
  }

  public toDO(): IWIPPet {
    return new WIPPet({
      name: this.name,
    });
  }

  public static toBodySchema() {
    return t.Object({
      name: t.String(),
    }, {
      description: 'Expected a name',
    });
  }
}

export const WIPPetDTO: IRequestDTO<IWIPPet> & IBodySchema = WIPPetDTOClass;
