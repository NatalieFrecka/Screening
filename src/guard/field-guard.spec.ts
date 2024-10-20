import { FieldGuard } from './field-guard';

describe('FieldGuard', () => {
  describe('getNearestProjectionField', () => {
    it('finds the closest projection key', () => {
      const actual = FieldGuard.getNearestProjectionField('commodity');
      expect(actual).toEqual('commodity');
    });

    it('finds the closest projection key regardless of case', () => {
      const actual = FieldGuard.getNearestProjectionField('CommodityType');
      expect(actual).toEqual('commodityType');
    });

    it.each(['id', 'createdAt', 'updatedAt', 'INVALID'])('throws given disallowed or invalid key %s', (key) => {
      const action = () => FieldGuard.getNearestProjectionField(key);
      expect(action).toThrow("Invalid field name");
    });
  });
});
