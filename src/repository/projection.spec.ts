import { TestingFactory } from '../../testing/factory';
import { ProjectionField, ProjectionValue } from '../types/ProjectionAliases';
import { ManyValuesTest, SingleValueTest } from '../../testing/test-types';
import { ProjectionRepo } from './projection';
import prisma from '../../prisma/client';
import { Projection } from '@prisma/client';

describe('ProjectionRepo', () => {
  describe('countSingleFieldValue', () => {
    test.each<SingleValueTest>([
      { field: 'attribute', value: 'Harvested acres' },
      { field: 'commodity', value: 'Rice' },
      { field: 'commodityType', value: 'Crops' },
      { field: 'units', value: 'Thousand acres' },
      { field: 'yearType', value: 'Market year' },
      { field: 'year', value: '2019/20' },
      { field: 'value', value: 2472 },
    ])('returns one for the number of $value $field instances there are', async ({ field, value }) => {
      await Promise.all([TestingFactory.insertProjection({ [field]: value })]);

      const actual = await ProjectionRepo.countSingleFieldValue(field, value);

      expect(actual).toEqual(TestingFactory.buildFieldCount(field, value));
    });

    test.each<SingleValueTest>([
      { field: 'attribute', value: 'Harvested acres' },
      { field: 'commodity', value: 'Rice' },
      { field: 'commodityType', value: 'Crops' },
      { field: 'units', value: 'Thousand acres' },
      { field: 'yearType', value: 'Market year' },
      { field: 'year', value: '2019/20' },
      { field: 'value', value: 2472 },
    ])('returns one for the number of $value $field appears in projections list', async ({ field, value }) => {
      await Promise.all([
        TestingFactory.insertProjection({ [field]: value }),
        TestingFactory.insertProjection({ [field]: value })
      ]);

      const actual = await ProjectionRepo.countSingleFieldValue(field, value);

      expect(actual).toEqual(TestingFactory.buildFieldCount(field, value, 2));
    });

    test.each<SingleValueTest>([
      { field: 'attribute', value: 'Harvested acres' },
      { field: 'commodity', value: 'Rice' },
      { field: 'commodityType', value: 'Crops' },
      { field: 'units', value: 'Thousand acres' },
      { field: 'yearType', value: 'Market year' },
      { field: 'year', value: '2019/20' },
      { field: 'value', value: 2472 },
    ])('returns the number of times a $value $field appears in list made up of varied projection', async ({
      field,
      value
    }) => {
      await Promise.all([
        TestingFactory.insertProjection({ [field]: value }),
        TestingFactory.insertProjection({ [field]: 'Do not pick me' }),
        TestingFactory.insertProjection({ [field]: value }),
      ]);

      const actual = await ProjectionRepo.countSingleFieldValue(field, value);

      expect(actual).toEqual(TestingFactory.buildFieldCount(field, value, 2));
    });
  });

  describe('countAllFieldValues', () => {
    test.each<SingleValueTest>([
      { field: 'attribute', value: 'Harvested acres' },
      { field: 'commodity', value: 'Rice' },
      { field: 'commodityType', value: 'Crops' },
      { field: 'units', value: 'Thousand acres' },
      { field: 'yearType', value: 'Market year' },
      { field: 'year', value: '2019/20' },
      { field: 'value', value: 2472 },
    ])('counts one $value $field occurrence', async ({ field, value }) => {
      await Promise.all([TestingFactory.insertProjection({ [field]: value })]);

      const actual = await ProjectionRepo.countAllFieldValues(field);

      expect(actual).toEqual([{ field, value, count: 1 }]);
    });

    test.each<ManyValuesTest>([
      {
        field: 'attribute',
        values: ['Harvested acres', 'Planted acre'],
        expected: [
          TestingFactory.buildFieldCount('attribute', 'Harvested acres'),
          TestingFactory.buildFieldCount('attribute', 'Planted acre')
        ],
      },
      {
        field: 'commodity',
        values: ['Barley', 'Corn', 'Rice'],
        expected: [
          TestingFactory.buildFieldCount('commodity', 'Barley'),
          TestingFactory.buildFieldCount('commodity', 'Corn'),
          TestingFactory.buildFieldCount('commodity', 'Rice'),
        ]
      },
      {
        field: 'commodityType',
        values: ['Crops', 'Livestock/Dairy'],
        expected: [
          TestingFactory.buildFieldCount('commodityType', 'Crops'),
          TestingFactory.buildFieldCount('commodityType', 'Livestock/Dairy'),
        ]
      },
      {
        field: 'units',
        values: ['Thousand acres', 'Pounds per capita'],
        expected: [
          TestingFactory.buildFieldCount('units', 'Pounds per capita'),
          TestingFactory.buildFieldCount('units', 'Thousand acres'),
        ]
      },
      {
        field: 'yearType',
        values: ['Market year', 'Calendar year'],
        expected: [
          TestingFactory.buildFieldCount('yearType', 'Calendar year'),
          TestingFactory.buildFieldCount('yearType', 'Market year'),
        ]
      },
      {
        field: 'year',
        values: ['2019/20', '2024'],
        expected: [
          TestingFactory.buildFieldCount('year', '2019/20'),
          TestingFactory.buildFieldCount('year', '2024'),
        ]
      },
      {
        field: 'value',
        values: [2472, 55.9],
        expected: [
          TestingFactory.buildFieldCount('value', 55.9),
          TestingFactory.buildFieldCount('value', 2472),
        ]
      },
    ])('counts one $value occurrence for each unique $field', async ({ field, values, expected }) => {
      await Promise.all(buildManyProjections(field, values));

      const actual = await ProjectionRepo.countAllFieldValues(field);

      expect(actual).toEqual(expected);
    });

    test.each<ManyValuesTest>([
      {
        field: 'attribute',
        values: ['Harvested acres', 'Planted acre', 'Harvested acres'],
        expected: [
          TestingFactory.buildFieldCount('attribute', 'Harvested acres', 2),
          TestingFactory.buildFieldCount('attribute', 'Planted acre')
        ],
      },
      {
        field: 'commodity',
        values: ['Barley', 'Corn', 'Corn', 'Barley', 'Rice', 'Barley'],
        expected: [
          TestingFactory.buildFieldCount('commodity', 'Barley', 3),
          TestingFactory.buildFieldCount('commodity', 'Corn', 2),
          TestingFactory.buildFieldCount('commodity', 'Rice'),
        ]
      },
      {
        field: 'commodityType',
        values: ['Crops', 'Livestock/Dairy', 'Livestock/Dairy'],
        expected: [
          TestingFactory.buildFieldCount('commodityType', 'Crops'),
          TestingFactory.buildFieldCount('commodityType', 'Livestock/Dairy', 2),
        ]
      },
      {
        field: 'units',
        values: ['Thousand acres', 'Pounds per capita', 'Thousand acres', 'Pounds per capita'],
        expected: [
          TestingFactory.buildFieldCount('units', 'Pounds per capita', 2),
          TestingFactory.buildFieldCount('units', 'Thousand acres', 2),
        ]
      },
      {
        field: 'yearType',
        values: ['Market year', 'Calendar year'],
        expected: [
          TestingFactory.buildFieldCount('yearType', 'Calendar year'),
          TestingFactory.buildFieldCount('yearType', 'Market year'),
        ]
      },
      {
        field: 'year',
        values: ['2019/20', '2024', '2024', '2024'],
        expected: [
          TestingFactory.buildFieldCount('year', '2019/20'),
          TestingFactory.buildFieldCount('year', '2024', 3),
        ]
      },
      {
        field: 'value',
        values: [2472, 55.9, 2472],
        expected: [
          TestingFactory.buildFieldCount('value', 55.9),
          TestingFactory.buildFieldCount('value', 2472, 2),
        ]
      },
    ])('counts each instance of a unique commodity', async ({ field, values, expected }) => {
      await Promise.all(buildManyProjections(field, values));

      const actual = await ProjectionRepo.countAllFieldValues(field);

      expect(actual).toEqual(expected);
    });
  });

  describe('upsertMany', () => {
    it('upserts a projection', async () => {
      const projection = TestingFactory.buildProjection();

      await ProjectionRepo.insertMany([projection]);

      const actual = await prisma.projection.findMany();
      expect(actual).toEqual([buildProjectionComparator(projection)]);
    });

    it('upserts many projections', async () => {
      const projection1 = TestingFactory.buildProjection();
      const projection2 = TestingFactory.buildProjection();
      const projections = [projection1, projection2,];

      await ProjectionRepo.insertMany(projections);

      const actual = await prisma.projection.findMany();
      expect(actual).toEqual([
        buildProjectionComparator(projection1),
        buildProjectionComparator(projection2)
      ]);
    });
  });
});

const buildManyProjections = (field: ProjectionField, values: ProjectionValue[]) =>
  values.map(v => TestingFactory.insertProjection({ [field]: v }));

const buildProjectionComparator = (projection: Partial<Projection>) => ({
  id: expect.any(String),
  createdAt: expect.anything(),
  updatedAt: null,
  ...projection,
});
