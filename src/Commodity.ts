export type Projection = {
  attribute: string,
  commodity: string,
  commodityType: string,
  units: string,
  yearType: string,
  year: string,
  value: number
};

export type CommodityCount = {
  commodity: string;
  count: number;
}

export const getAllCommodityCount = (projections: Projection[]): CommodityCount[] =>
  projections.reduce((counts: CommodityCount[], projection: Projection) => {
    const existing = counts.find(el => el.commodity === projection.commodity);
    return existing ? updateCommodityCount(counts, existing) : addNewCommodityCount(counts, projection);
  }, []).sort(sortByCommodity);

const updateCommodityCount = (counts: CommodityCount[], existing: CommodityCount) => {
  const rest = counts.filter(a => a.commodity !== existing.commodity);
  return [...rest, { ...existing, count: existing.count + 1 }];
};

const addNewCommodityCount = (counts: CommodityCount[], projection: Projection) =>
  [...counts, { commodity: projection.commodity, count: 1 }];

const sortByCommodity = ({ commodity: commodityA }: CommodityCount, { commodity: commodityB }: CommodityCount): number => {
  if (commodityA === commodityB) return 0;
  return commodityA.localeCompare(commodityB);
};

export const getCommodityCount = (requestedCommodity: string, projections: Projection[]): CommodityCount => {
  const count = projections.filter(({ commodity }) => commodity === requestedCommodity).length;
  return { commodity: requestedCommodity, count: count };
};
