import { ProjectionRow } from '../types/ProjectionRow';

export const ProjectionRowTransformer = {
  toProjection: (row: ProjectionRow) => ({
    attribute: row.Attribute,
    commodity: row.Commodity,
    commodityType: row.CommodityType,
    units: row.Units,
    yearType: row.YearType,
    year: row.Year,
    value: row.Value
  })
};
