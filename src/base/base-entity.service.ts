import { Inject, Injectable, SerializeOptions } from '@nestjs/common';
import {
    Connection,
    DeepPartial,
    EntityManager,
    FindConditions,
    SelectQueryBuilder,
} from 'typeorm';

export interface EmptyObject {}

export type ID = number | string;

export interface CommonFilter {
  limit?: number;
  offset?: number;
  sort?: string;
}

@Injectable()
@SerializeOptions({
    excludeExtraneousValues: true,
})
export class BaseEntityService<
  Entity extends { id: ID },
  FindFilter extends EmptyObject,
> {
  @Inject(Connection) protected connection: Connection;
  @Inject(EntityManager) protected entityManager: EntityManager;

  constructor(private model: new () => Entity) {}

  async find(filter: FindFilter & CommonFilter): Promise<Entity[]> {
      const { sort = 'id:ASC' } = filter; // offset = 0, limit = 20,

      let query = this.getFindQuery(filter);

      const order = this.parseSort(sort);

      for (const [column, direction] of order) {
          query = query.addOrderBy(column, direction);
      }

      return query.getMany();
  }

  async count(filter: FindFilter): Promise<number> {
      const query = this.getFindQuery(filter);

      return query.getCount();
  }

  protected getFindQuery(filter: FindFilter): SelectQueryBuilder<Entity> {
      return this.connection
          .createQueryBuilder()
          .select()
          .from(this.model, 'root')
          .where(filter);
  }

  private parseSort(sort: string): [string, 'ASC' | 'DESC'][] {
      const result = sort
          .split(',')
          .map((row) => BaseEntityService.parseSortRow(row.trim()));

      if (result.length === 0) {
          return [['root.id', 'ASC']];
      }

      return result;
  }

  private static parseSortRow(sort: string): [string, 'ASC' | 'DESC'] {
      const [rawColumn, direction] = sort.split(':');

      const column = rawColumn.includes('.') ? rawColumn : `root.${rawColumn}`;

      if (direction !== 'ASC' && direction !== 'DESC') {
          return [column, 'ASC'];
      }

      return [column, direction];
  }

  async findById(value: ID): Promise<Entity | undefined> {
      return (await this.entityManager.findOne(this.model, {
          id: value,
      })) as unknown as Promise<Entity | undefined>;
  }

  async findOne(
      conditions?: FindConditions<Entity>,
  ): Promise<Entity | undefined> {
      return this.entityManager.findOne(this.model, conditions);
  }

  async create(plainObject: DeepPartial<Entity>): Promise<Entity> {
      const entity = this.entityManager.create(this.model, plainObject);

      await this.entityManager.save(entity);

      return entity;
  }

  async update(
      id: ID | Entity,
      body: DeepPartial<Entity>,
  ): Promise<Entity | undefined> {
      const entity = (
      typeof id === 'number' || typeof id === 'string'
          ? await this.findById(id)
          : id
    ) as Entity;

      if (!entity) {
          return undefined;
      }

      Object.assign(entity, body);

      await this.entityManager.save(entity);

      return entity;
  }

  async remove(id: ID): Promise<Entity | undefined> {
      const entity = await this.entityManager.findOne(this.model, id);

      if (!entity) {
          return undefined;
      }

      await this.entityManager.remove(entity);

      return entity;
  }
}
