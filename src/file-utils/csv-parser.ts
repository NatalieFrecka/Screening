import { Readable } from 'node:stream';
import csv from 'csv-parser';

export const CSV = {
  parse: <T>(stream: Readable): Promise<T[]> => new Promise((resolve, reject) => {
    const results: T[] = [];

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));

    return results;
  })
};
