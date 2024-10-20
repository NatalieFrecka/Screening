import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { Readable } from 'node:stream';

export const S3 = {
  s3Client: new S3Client({ region: process.env.AWS_REGION }),

  getMostRecentFileBody: async (event: S3Event): Promise<Readable> => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = { Bucket: bucket, Key: key };
    const response = await S3.s3Client.send(new GetObjectCommand(params));

    if (!response || response.ContentType !== 'text/csv' || !response.Body) {
      throw new Error('Invalid file type');
    }

    return response.Body as Readable;
  }
};
