import { Projection } from '@prisma/client';

export type ProjectionField = keyof Projection;

export type ProjectionValue = string | number | Date;
