import { Readable } from 'node:stream';
import { CSV } from './csv-parser';
import { ProjectionRow } from '../types/ProjectionRow';

describe('CSV parser', () => {
  it('parses a csv file', async () => {
    const string = 'Attribute,Commodity\nHarvested Acres,Corn\nHarvested Acres,Rice';
    const readable = Readable.from([string]);

    const actual = await CSV.parse<Pick<ProjectionRow, "Attribute" | "Commodity">>(readable);

    expect(actual).toEqual([
      { Attribute: 'Harvested Acres', Commodity: 'Corn' },
      { Attribute: 'Harvested Acres', Commodity: 'Rice' },
    ]);
  });
});
