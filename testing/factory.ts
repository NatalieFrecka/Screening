import { Projection } from '../src/Commodity';

export const TestingFactory = {
  buildProjection: ({
    attribute = 'Harvested acres',
    commodity = 'Rice',
    commodityType = 'Crops',
    units = 'Thousand acres',
    yearType = 'Market year',
    year = '2019/20',
    value = 2472
  }: Partial<Projection> = {}): Projection => ({
    attribute,
    commodity,
    commodityType,
    units,
    yearType,
    year,
    value
  })
};
