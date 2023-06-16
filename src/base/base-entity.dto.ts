import { ClassConstructor, plainToClass } from 'class-transformer';

import { EmptyObject } from './base-entity.service';

export interface BaseEntityDtoInterface<
  EntityDocument,
  EntityDto,
  PopulatedDocument = EntityDocument,
> {
  create(item: EntityDocument | PopulatedDocument): EntityDto;
  create(items: EntityDocument[] | PopulatedDocument[]): EntityDto[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function BaseEntityDto<
  EntityDocument extends EmptyObject,
  EntityDtoResult,
>() {
  abstract class EntityDto {
    public static create(item: EntityDocument): EntityDto;
    public static create(items: EntityDocument[]): EntityDto[];
    public static create(
      items: EntityDocument | EntityDocument[],
    ): EntityDto | EntityDto[] {
      return plainToClass(
        this as unknown as ClassConstructor<EntityDto>,
        items,
        {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        },
      );
    }
  }

  return EntityDto as unknown as ClassConstructor<EmptyObject> &
    BaseEntityDtoInterface<EntityDocument, EntityDtoResult>;
}
