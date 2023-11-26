import { Controller, IAppPlugin, t } from '../../controller';
import { protect, validate, IProtectConfig } from '../../middlewares';
import { ValidationError } from '../../errors';

import { PetsService } from './Pets.service';
import { PetDTO, WIPPetDTO } from './Pets.dto';
import { Tag } from './tag';

interface IConfig extends IProtectConfig {
  petsService: PetsService;
}

const getRoutes = (config: IConfig): IAppPlugin => {
  const { petsService } = config;

  const protectMiddleware = protect(config);
  const validateWIPPetMiddleware = validate(WIPPetDTO);

  return new Controller('/pets')
    .get('/', async ({ claims }) => {
      const pet = await petsService.getPets(claims);

      return {
        items: pet.items.map((item) => PetDTO.fromDO(item).toBody()),
      };
    }, {
      beforeHandle: [protectMiddleware],
      response: {
        200: t.Object({
          items: t.Array(PetDTO.toResponseSchema()),
        }, {
          description: 'List of current user pets',
        }),
      },
      detail: {
        summary: 'Get the current user pets',
        tags: [Tag.Pets],
      },
    })
    .post('/', async ({ claims, data }) => {
      const pet = await petsService.registerPet(claims, data);

      return PetDTO.fromDO(pet).toBody();
    }, {
      beforeHandle: [protectMiddleware, validateWIPPetMiddleware],
      body: WIPPetDTO.toBodySchema(),
      response: {
        200: PetDTO.toResponseSchema(),
      },
      detail: {
        summary: 'Register current user pet',
        tags: [Tag.Pets],
      },
    })
    .put('/:id', async ({ claims, params, data }) => {
      if (!params.id) throw new ValidationError('Id is required');
      
      const pet = await petsService.updatePet(
        claims,
        params.id,
        data,
      );

      return PetDTO.fromDO(pet).toBody();
    }, {
      beforeHandle: [protectMiddleware, validateWIPPetMiddleware],
      params: t.Object({
        id: t.String(),
      }),
      body: WIPPetDTO.toBodySchema(),
      response: {
        200: PetDTO.toResponseSchema(),
      },
      detail: {
        summary: 'Update current user pet',
        tags: [Tag.Pets],
      },
    })
    .delete('/:id', async ({ claims, params }) => {
      if (!params.id) throw new ValidationError('Id is required');
      
      const pet = await petsService.deletePet(
        claims,
        params.id,
      );

      return PetDTO.fromDO(pet).toBody();
    }, {
      beforeHandle: [protectMiddleware],
      params: t.Object({
        id: t.String(),
      }),
      body: WIPPetDTO.toBodySchema(),
      response: {
        200: PetDTO.toResponseSchema(),
      },
      detail: {
        summary: 'Delete current user pet',
        tags: [Tag.Pets],
      },
    });
};

export default getRoutes;
