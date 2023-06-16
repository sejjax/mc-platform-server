import { NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { BaseEntityService, EmptyObject, ID } from './base-entity.service';

interface EntityDtoConstructor<Entity, EntityDto> {
  create(entity: Entity): EntityDto;
  create(entity: Entity[]): EntityDto[];
}

export class BaseEntityController<
  Entity extends { id: ID },
  FindFilter extends EmptyObject,
  EntityDto extends EmptyObject,
> {
  constructor(
    private baseService: BaseEntityService<Entity, FindFilter>,
    private entityDtoClass: EntityDtoConstructor<Entity, EntityDto>,
  ) {}

  async find(filter: FindFilter): Promise<EntityDto[]> {
    const entities = await this.baseService.find(filter);

    return this.entityDtoClass.create(entities);
  }

  async count(filter: FindFilter): Promise<number> {
    return this.baseService.count(filter);
  }

  async findOne(id: ID): Promise<EntityDto> {
    const entity = await this.baseService.findById(id);

    if (!entity) {
      throw new NotFoundException();
    }

    return this.entityDtoClass.create(entity);
  }

  async create(plainObject: DeepPartial<Entity>): Promise<EntityDto> {
    const entity = await this.baseService.create(plainObject);

    return this.entityDtoClass.create(entity);
  }

  async update(id: ID, plainObject: DeepPartial<Entity>): Promise<EntityDto> {
    const entity = await this.baseService.update(id, plainObject);

    if (!entity) {
      throw new NotFoundException();
    }

    return this.entityDtoClass.create(entity);
  }

  async remove(id: ID): Promise<void> {
    const entity = await this.baseService.remove(id);

    if (!entity) {
      throw new NotFoundException();
    }
  }
}
