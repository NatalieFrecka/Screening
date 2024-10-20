import prisma from '../../prisma/client';
import { Prisma, Projection } from '@prisma/client';
import { ProjectionFieldCount } from '../types/ProjectionFieldCount';
import { ProjectionField, ProjectionValue } from '../types/ProjectionAliases';

export const ProjectionRepo = {
  countSingleFieldValue: async (
    field: ProjectionField,
    value: ProjectionValue
  ): Promise<ProjectionFieldCount> => {
    const count = await prisma.projection.count({ where: { [field]: value } });
    return { field, value, count };
  },

  countAllFieldValues: async (field: keyof Projection): Promise<ProjectionFieldCount[]> => {
    const groups = await prisma.projection.groupBy({
      by: [field],
      orderBy: { [field]: Prisma.SortOrder.asc } as Prisma.ProjectionGroupByArgs['orderBy'],
      _count: { [field]: true }
    });

    return groups.map(g => ({ field, value: g[field], count: g._count[field] }));
  },

  insertMany: async (data: Omit<Projection, 'id' | 'createdAt' | 'updatedAt'>[]) =>
    prisma.projection.createMany({ data })
};
