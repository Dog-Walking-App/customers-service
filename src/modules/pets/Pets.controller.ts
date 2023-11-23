import { t } from 'elysia';

import { Controller, IAppPlugin } from '../../controller';
import { protect, validate, IProtectConfig } from '../../middlewares';

import { PetsService } from './Pets.service';
import { PetDTO, WIPPetDTO } from './Pets.dto';

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
        tags: ['pets'],
      },
    })
    .post('/', async ({ claims, data }) => {
      const pet = await petsService.registerPet(claims, data);

      return PetDTO.fromDO(pet).toBody();
    }, {
      beforeHandle: [protectMiddleware, validateWIPPetMiddleware],
      body: WIPPetDTO.toBodySchema(),
      detail: {
        summary: 'Register current user pet',
        tags: ['pets'],
      },
    })
    .put('/:id', async ({ claims, params, data }) => {
      if (!params.id) throw new Error('Id is required');
      
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
      detail: {
        summary: 'Update current user pet',
        tags: ['pets'],
      },
    })
    .delete('/:id', async ({ claims, params }) => {
      if (!params.id) throw new Error('Id is required');
      
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
      detail: {
        summary: 'Delete current user pet',
        tags: ['pets'],
      },
    });
};

export default getRoutes;
