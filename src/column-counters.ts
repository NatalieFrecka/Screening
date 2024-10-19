import { ProjectionField, ProjectionValue } from './Projection';
import { ProjectionFieldCount } from './ProjectionFieldCount';
import prisma from '../prisma/client';
import { Prisma, Projection } from '@prisma/client';

export const getCountForFieldValue = async (
  field: ProjectionField,
  value: ProjectionValue
): Promise<ProjectionFieldCount> => {
  const count = await prisma.projection.count({ where: { [field]: value } });
  return { field, value, count };
};

export const getCountsForAllFieldValues = async (field: keyof Projection): Promise<ProjectionFieldCount[]> => {
  const groups = await prisma.projection.groupBy({
    by: [field] as Prisma.ProjectionGroupByArgs['by'],
    orderBy: { [field]: Prisma.SortOrder.asc } as Prisma.ProjectionGroupByArgs['orderBy'],
    _count: { [field]: true }
  });

  return groups.map(g => ({ field, value: g[field], count: g._count[field] }));
};
