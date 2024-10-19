import { Projection, ProjectionField, ProjectionValue } from './Projection';
import { ProjectionFieldCount } from './ProjectionFieldCount';

export const getCountForFieldValue = (
  projections: Projection[],
  field: ProjectionField,
  value: ProjectionValue
): ProjectionFieldCount => {
  const count = projections.filter((p) => p[field] === value).length;
  return { field, value, count };
};

export const getCountsForAllFieldValues = (
  projections: Projection[],
  field: ProjectionField
): ProjectionFieldCount[] =>
  projections.reduce((counts: ProjectionFieldCount[], projection: Projection) => {
    const existing = counts.find(el => el.value === projection[field]);
    return existing ? updateCommodityCount(counts, existing) : addNewCommodityCount(counts, field, projection[field]);
  }, []).sort(sortByCommodity);

const updateCommodityCount = (
  counts: ProjectionFieldCount[],
  existing: ProjectionFieldCount
): ProjectionFieldCount[] => {
  const rest = counts.filter(a => a.value !== existing.value);
  return [...rest, { ...existing, count: existing.count + 1 }];
};

const addNewCommodityCount = (
  counts: ProjectionFieldCount[],
  field: ProjectionField,
  value: ProjectionValue
): ProjectionFieldCount[] =>
  [...counts, { field, value, count: 1 }];

const sortByCommodity = (
  { value: valueA }: ProjectionFieldCount,
  { value: valueB }: ProjectionFieldCount
): number => {
  if (valueA === valueB) return 0;
  return valueA.toString().localeCompare(valueB.toString());
};
