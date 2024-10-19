export type Projection = {
  attribute: string;
  commodity: string;
  commodityType: string;
  units: string;
  yearType: string;
  year: string;
  value: number;
};

export type ProjectionField = keyof Projection;

export type ProjectionValue = string | number;
