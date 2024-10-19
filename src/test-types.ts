import { ProjectionField, ProjectionValue } from './Projection';
import { ProjectionFieldCount } from './ProjectionFieldCount';

export type SingleValueTest = {
  field: ProjectionField,
  value: ProjectionValue
}

export type ManyValuesTest = {
  field: ProjectionField,
  values: ProjectionValue[],
  expected: ProjectionFieldCount[]
}
