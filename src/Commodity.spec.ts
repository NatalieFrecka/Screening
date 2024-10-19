import { getAllCommodityCount, getCommodityCount } from './Commodity';
import { TestingFactory } from '../testing/factory';

describe('Commodity', () => {
  describe('getCommodityCount', () => {
    it('returns one for the number of rice commodities there are', () => {
      const riceCommodity1 = TestingFactory.buildProjection();

      const actual = getCommodityCount('Rice', [riceCommodity1]);

      expect(actual).toBe(1);
    });

    it('returns the number of times a rice appears in projections list', () => {
      const riceCommodity1 = TestingFactory.buildProjection();
      const riceCommodity2 = TestingFactory.buildProjection();

      const actual = getCommodityCount('Rice', [riceCommodity1, riceCommodity2]);

      expect(actual).toBe(2);
    });

    it('returns the number of times a rice appears in list made up of varied projection', () => {
      const riceCommodity1 = TestingFactory.buildProjection();
      const riceCommodity2 = TestingFactory.buildProjection();
      const cornCommodity = TestingFactory.buildProjection({ commodity: 'Corn' });

      const actual = getCommodityCount('Rice', [riceCommodity1, riceCommodity2, cornCommodity]);

      expect(actual).toBe({ name: 'Rice', count: 2 });
    });
  });

  describe('getAllCommodityCount', () => {
    it('counts one commodity occurrence', () => {
      const projections = [TestingFactory.buildProjection()];

      const actual = getAllCommodityCount(projections);

      expect(actual).toEqual([{ commodity: 'Rice', count: 1 }]);
    });

    it('counts one commodity occurrence for each unique commodity', () => {
      const projections = [
        TestingFactory.buildProjection({ commodity: 'Barley' }),
        TestingFactory.buildProjection({ commodity: 'Corn' }),
        TestingFactory.buildProjection(),
      ];

      const actual = getAllCommodityCount(projections);

      expect(actual).toEqual([
        { commodity: 'Barley', count: 1 },
        { commodity: 'Corn', count: 1 },
        { commodity: 'Rice', count: 1 }
      ]);
    });

    it('alphabetizes the list by commodity', () => {
      const projections = [
        TestingFactory.buildProjection(),
        TestingFactory.buildProjection({ commodity: 'Barley' }),
        TestingFactory.buildProjection({ commodity: 'Corn' }),
      ];

      const actual = getAllCommodityCount(projections);

      expect(actual).toEqual([
        { commodity: 'Barley', count: 1 },
        { commodity: 'Corn', count: 1 },
        { commodity: 'Rice', count: 1 }
      ]);
    });

    it('counts each instance of a unique commodity', () => {
      const projections = [
        TestingFactory.buildProjection({ commodity: 'Corn' }),
        TestingFactory.buildProjection({ commodity: 'Barley' }),
        TestingFactory.buildProjection({ commodity: 'Rice' }),
        TestingFactory.buildProjection({ commodity: 'Barley' }),
        TestingFactory.buildProjection({ commodity: 'Corn' }),
        TestingFactory.buildProjection({ commodity: 'Barley' }),
      ];

      const actual = getAllCommodityCount(projections);

      expect(actual).toEqual([
        { commodity: 'Barley', count: 3 },
        { commodity: 'Corn', count: 2 },
        { commodity: 'Rice', count: 1 }
      ]);
    });
  });
});
