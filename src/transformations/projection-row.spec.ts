import { TestingFactory } from '../../testing/factory';
import { ProjectionRowTransformer } from './projection-row';

describe('ProjectionRowTransformer', () => {
  describe('toProjectionRow()', () => {
    it('transform ProjectionRow into Projection', () => {
      const row = TestingFactory.buildProjectionRow();

      const actual = ProjectionRowTransformer.toProjection(row);

      expect(actual).toEqual({
        attribute: row.Attribute,
        commodity: row.Commodity,
        commodityType: row.CommodityType,
        units: row.Units,
        yearType: row.YearType,
        year: row.Year,
        value: row.Value,
      });
    });
  });
});
