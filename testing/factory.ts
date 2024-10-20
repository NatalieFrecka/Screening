import { ProjectionField, ProjectionValue } from '../src/types/ProjectionAliases';
import { ProjectionFieldCount } from '../src/types/ProjectionFieldCount';
import { Projection } from '@prisma/client';
import prisma from '../prisma/client';
import { faker } from '@faker-js/faker';
import { ProjectionRow } from '../src/types/ProjectionRow';

export const TestingFactory = {
  buildProjectionRow: (row: Partial<ProjectionRow> = {}): ProjectionRow => ({
    Attribute: faker.lorem.words(2),
    Commodity: faker.food.vegetable(),
    CommodityType: faker.lorem.words(2),
    Units: faker.science.unit().name,
    YearType: faker.lorem.words(2),
    Year: `${faker.number.int({ min: 2019, max: 2040 })}/${faker.number.int({ min: 2019, max: 2040 })}`,
    Value: faker.number.int().toString(),
    ...row
  }),

  buildProjection: (projection: Partial<Projection> = {}): Omit<Projection, 'id' | 'createdAt' | 'updatedAt'> => ({
    attribute: faker.lorem.words(2),
    commodity: faker.food.vegetable(),
    commodityType: faker.lorem.words(2),
    units: faker.science.unit().name,
    yearType: faker.lorem.words(2),
    year: `${faker.number.int({ min: 2019, max: 2040 })}/${faker.number.int({ min: 2019, max: 2040 })}`,
    value: faker.number.int(),
    ...projection
  }),

  insertProjection: async (projection: Partial<Projection> = {}): Promise<Projection> =>
    prisma.projection.create({ data: TestingFactory.buildProjection(projection) }),

  buildFieldCount: (
    field: ProjectionField,
    value: ProjectionValue,
    count: number = 1
  ): ProjectionFieldCount => ({ field, value, count })
};
