import { handler } from './csv-parser-handler';
import { S3Event } from 'aws-lambda';
import path from 'path';
import fs from 'fs';
import { mockClient } from 'aws-sdk-client-mock';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import prisma from '../../prisma/client';
import { sdkStreamMixin } from '@smithy/util-stream';

describe('CSV Parser Handler', () => {
  it('writes projections to the db given a valid csv file', async () => {
    mockS3File();

    const response = await handler(buildEvent());

    const projections = await prisma.projection.count();
    expect(response.statusCode).toBe(200);
    expect(projections).toBeGreaterThan(1);
  });

  it('throws given the file content type is not csv', async () => {
    mockS3File('text/text');

    const response = await handler(buildEvent());

    const projections = await prisma.projection.count();
    expect(response.statusCode).toBe(500);
    expect(projections).toBe(0);
  });

  it('throws given there is no file body content', async () => {
    mockS3File('text/csv', false);

    const response = await handler(buildEvent());

    const projections = await prisma.projection.count();
    expect(response.statusCode).toBe(500);
    expect(projections).toBe(0);
  });

  const buildEvent = () => ({
    Records: [{
      s3: {
        bucket: 'My Bucket',
        object: { key: '' }
      }
    }]
  }) as unknown as S3Event;

  const mockS3File = (contentType: string = 'text/csv', includeFile = true) => {
    const mockS3Client = mockClient(S3Client);

    const csvFilePath = path.resolve(__dirname, '../../testing/Projection2021.csv');
    const body = fs.createReadStream(csvFilePath);

    mockS3Client.on(GetObjectCommand).resolves({
      ContentType: contentType,
      Body: includeFile ? sdkStreamMixin(body) : undefined,
    });
  };
});
