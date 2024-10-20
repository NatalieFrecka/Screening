import { ProjectionField, ProjectionValue } from '../src/types/ProjectionAliases';
import { ProjectionFieldCount } from '../src/types/ProjectionFieldCount';

export type SingleValueTest = {
  field: ProjectionField,
  value: ProjectionValue
}

export type ManyValuesTest = {
  field: ProjectionField,
  values: ProjectionValue[],
  expected: ProjectionFieldCount[]
}
