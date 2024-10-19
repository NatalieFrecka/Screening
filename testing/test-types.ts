import { ProjectionField, ProjectionValue } from '../src/Projection';
import { ProjectionFieldCount } from '../src/ProjectionFieldCount';

export type SingleValueTest = {
  field: ProjectionField,
  value: ProjectionValue
}

export type ManyValuesTest = {
  field: ProjectionField,
  values: ProjectionValue[],
  expected: ProjectionFieldCount[]
}
