import { Projection } from '@prisma/client';
import { InvalidFieldError } from '../error/InvalidFieldError';

const allowedProjectionFields: (keyof Projection)[] = [
  'attribute',
  'commodity',
  'commodityType',
  'units',
  'yearType',
  'year',
  'value'
];

export const FieldGuard = {
  getNearestProjectionField: (field?: string): keyof Projection => {
    const matchingProjectionKey = allowedProjectionFields.find(key => key.toLowerCase() === field?.toLowerCase());

    if (!matchingProjectionKey) {
      throw new InvalidFieldError(field ?? '');
    }

    return matchingProjectionKey;
  }
};
