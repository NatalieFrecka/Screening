import { mockClient } from 'aws-sdk-client-mock';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { sdkStreamMixin } from '@smithy/util-stream';
import { S3Event } from 'aws-lambda';

export const AWSMock = {
  buildS3Event: () => ({
    Records: [{
      s3: {
        bucket: 'My Bucket',
        object: { key: '' }
      }
    }]
  }) as unknown as S3Event,

  mockS3File: (contentType: string = 'text/csv', content?: string) => {
    const mockS3Client = mockClient(S3Client);
    const body = Readable.from([content]);

    mockS3Client.on(GetObjectCommand).resolves({
      ContentType: contentType,
      Body: content ? sdkStreamMixin(body) : undefined,
    });
  }
}
