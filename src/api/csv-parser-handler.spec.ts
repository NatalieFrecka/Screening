import { handler } from './csv-parser-handler';
import prisma from '../../prisma/client';
import { AWSMock } from '../../testing/aws-mock';
import { mockClient } from 'aws-sdk-client-mock';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs';
import { sdkStreamMixin } from '@smithy/util-stream';

describe('CSV Parser Handler', () => {
  beforeEach(() => {
    process.env.AWS_REGION = 'us-east-2';
  });

  it('writes projections to the db given a valid csv file', async () => {
    mockFullProjectionFile();
    const event = AWSMock.buildS3Event();

    const response = await handler(event);

    const projections = await prisma.projection.count();
    expect(response.statusCode).toBe(200);
    expect(projections).toBeGreaterThan(1);
  });

  it('returns a 500 given the AWS_REGION is not defined', async () => {
    process.env = {};
    AWSMock.mockS3File('text/text', 'Hi');
    const event = AWSMock.buildS3Event();

    const response = await handler(event);

    const projections = await prisma.projection.count();
    expect(response.statusCode).toBe(500);
    expect(projections).toBe(0);
  });

  it('returns a 400 given the file content type is not csv', async () => {
    AWSMock.mockS3File('text/text', "Hi");
    const event = AWSMock.buildS3Event();

    const response = await handler(event);

    const projections = await prisma.projection.count();
    expect(response.statusCode).toBe(400);
    expect(projections).toBe(0);
  });

  it('returns a 400 given there is no file body content', async () => {
    AWSMock.mockS3File('text/csv');
    const event = AWSMock.buildS3Event();

    const response = await handler(event);

    const projections = await prisma.projection.count();
    expect(response.statusCode).toBe(400);
    expect(projections).toBe(0);
  });

  const mockFullProjectionFile = (contentType: string = 'text/csv', includeFile = true) => {
    const mockS3Client = mockClient(S3Client);

    const csvFilePath = path.resolve(__dirname, '../../testing/Projection2021.csv');
    const body = fs.createReadStream(csvFilePath);

    mockS3Client.on(GetObjectCommand).resolves({
      ContentType: contentType,
      Body: includeFile ? sdkStreamMixin(body) : undefined,
    });
  };
});
