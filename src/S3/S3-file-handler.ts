import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { Readable } from 'node:stream';
import { InvalidFileTypeError } from '../error/InvalidFileTypeError';
import { MissingFileContentError } from '../error/MissingFileContentError';
import { MissingEnvironmentError } from '../error/MissingEnvironmentError';

export const S3 = {
  s3Client: () => {
    const region = process.env.AWS_REGION;
    const endpoint = process.env.AWS_S3_ENDPOINT;

    if (!region || !endpoint) {
      throw new MissingEnvironmentError('AWS Variable');
    }

    return new S3Client({
      region,
      endpoint,
      forcePathStyle: true,
    });
  },

  getMostRecentFileBody: async (event: S3Event): Promise<Readable> => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = { Bucket: bucket, Key: key };
    const response = await S3.s3Client().send(new GetObjectCommand(params));

    if (response.ContentType !== 'text/csv') {
      throw new InvalidFileTypeError('text/csv');
    }

    if (!response.Body) {
      throw new MissingFileContentError();
    }

    return response.Body as Readable;
  }
};
