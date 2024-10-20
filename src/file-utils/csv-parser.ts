import { Readable } from 'node:stream';
import csv from 'csv-parser';

export const CSV = {
  parse: <T>(stream: Readable): Promise<T[]> => new Promise((resolve, reject) => {
    const results: T[] = [];

    stream
      .pipe(csv())
      .on('data', (data) => {
        const normalized = CSV.normalize<T>(data);
        return results.push(normalized);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));

    return results;
  }),

  normalize: <T>(data: any): T =>
    Object.keys(data).reduce((acc: any, key: string) => {
      acc[key.trim()] = data[key];
      return acc;
    }, {} as T)
};

