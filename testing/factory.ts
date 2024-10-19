import { ProjectionField, ProjectionValue } from '../src/Projection';
import { ProjectionFieldCount } from '../src/ProjectionFieldCount';
import { Projection } from '@prisma/client';
import prisma from '../prisma/client';
import { faker } from '@faker-js/faker';

export const TestingFactory = {
  insertProjection: async (projection: Partial<Projection> = {}): Promise<Projection> =>
    prisma.projection.create({
      data: {
        attribute: faker.lorem.words(2),
        commodity: faker.food.vegetable(),
        commodityType: faker.lorem.words(2),
        units: faker.science.unit().name,
        yearType: faker.lorem.words(2),
        year: `${faker.number.int({ min: 2019, max: 2040 })}/${faker.number.int({ min: 2019, max: 2040 })}}`,
        value: faker.number.int(),
        ...projection
      }
    }),

  buildFieldCount: (
    field: ProjectionField,
    value: ProjectionValue,
    count: number = 1
  ): ProjectionFieldCount => ({ field, value, count })
};
