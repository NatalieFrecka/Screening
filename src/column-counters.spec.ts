import { TestingFactory } from '../testing/factory';
import { getCountForFieldValue, getCountsForAllFieldValues } from './column-counters';
import { ProjectionField, ProjectionValue } from './Projection';
import { ManyValuesTest, SingleValueTest } from './test-types';

describe('Column Counters', () => {
  describe('getSingleCount', () => {
    test.each<SingleValueTest>([
      { field: 'commodity', value: 'Rice' }
    ])('returns one for the number of $value $field instances there are', ({ field, value }) => {
      const projections = [TestingFactory.buildProjection({ [field]: value })];

      const actual = getCountForFieldValue(projections, field, value);

      expect(actual).toEqual(TestingFactory.buildFieldCount(field, value));
    });

    test.each<SingleValueTest>([
      { field: 'commodity', value: 'Rice' }
    ])('returns one for the number of $value $field appears in projections list', ({ field, value }) => {
      const projections = [
        TestingFactory.buildProjection({ [field]: value }),
        TestingFactory.buildProjection({ [field]: value })
      ];

      const actual = getCountForFieldValue(projections, field, value);

      expect(actual).toEqual(TestingFactory.buildFieldCount(field, value, 2));
    });

    test.each<SingleValueTest>([
      { field: 'commodity', value: 'Rice' }
    ])('returns the number of times a $value $field appears in list made up of varied projection', ({
      field,
      value
    }) => {
      const projections = [
        TestingFactory.buildProjection({ [field]: value }),
        TestingFactory.buildProjection({ [field]: 'Do not pick me' }),
        TestingFactory.buildProjection({ [field]: value }),
      ];

      const actual = getCountForFieldValue(projections, field, value);

      expect(actual).toEqual(TestingFactory.buildFieldCount(field, value, 2));
    });
  });

  describe('getAllCommodityCount', () => {
    test.each<SingleValueTest>([
      { field: 'commodity', value: 'Rice' }
    ])('counts one $value $field occurrence', ({ field, value }) => {
      const projections = [TestingFactory.buildProjection({ [field]: value })];

      const actual = getCountsForAllFieldValues(projections, field);

      expect(actual).toEqual([{ field, value, count: 1 }]);
    });

    test.each<ManyValuesTest>([
      {
        field: 'commodity',
        values: ['Barley', 'Corn', 'Rice'],
        expected: [
          TestingFactory.buildFieldCount('commodity', 'Barley'),
          TestingFactory.buildFieldCount('commodity', 'Corn'),
          TestingFactory.buildFieldCount('commodity', 'Rice'),
        ]
      }
    ])('counts one commodity occurrence for each unique commodity', ({ field, values, expected }) => {
      const projections = buildManyProjections(field, values);

      const actual = getCountsForAllFieldValues(projections, field);

      expect(actual).toEqual(expected);
    });

    test.each<ManyValuesTest>([
      {
        field: 'commodity',
        values: ['Rice', 'Barley', 'Corn'],
        expected: [
          TestingFactory.buildFieldCount('commodity', 'Barley'),
          TestingFactory.buildFieldCount('commodity', 'Corn'),
          TestingFactory.buildFieldCount('commodity', 'Rice'),
        ]
      }
    ])('alphabetizes the list by commodity', ({ field, values, expected }) => {
      const projections = buildManyProjections(field, values);

      const actual = getCountsForAllFieldValues(projections, field);

      expect(actual).toEqual(expected);
    });

    test.each<ManyValuesTest>([
      {
        field: 'commodity',
        values: ['Corn', 'Barley', 'Rice', 'Barley', 'Corn', 'Barley'],
        expected: [
          TestingFactory.buildFieldCount('commodity', 'Barley', 3),
          TestingFactory.buildFieldCount('commodity', 'Corn', 2),
          TestingFactory.buildFieldCount('commodity', 'Rice'),
        ]
      }
    ])('counts each instance of a unique commodity', ({ field, values, expected }) => {
      const projections = buildManyProjections(field, values);

      const actual = getCountsForAllFieldValues(projections, field);

      expect(actual).toEqual(expected);
    });
  });
});


const buildManyProjections = (field: ProjectionField, values: ProjectionValue[]) =>
  values.map(v => TestingFactory.buildProjection({ [field]: v }));
