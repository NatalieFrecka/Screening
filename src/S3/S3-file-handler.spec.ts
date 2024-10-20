import { S3 } from './S3-file-handler';
import { MissingEnvironmentError } from '../error/MissingEnvironmentError';
import { InvalidFileTypeError } from '../error/InvalidFileTypeError';
import { MissingFileContentError } from '../error/MissingFileContentError';
import { AWSMock } from '../../testing/aws-mock';

describe('S3FileHandler', () => {
  beforeEach(() => {
    process.env.AWS_REGION = 'us-east-2';
    process.env.AWS_S3_ENDPOINT = 'http://localhost:9999';
  });

  describe('getMostRecentFileBody', () => {
    it('throws given the aws region variable is undefined', () => {
      process.env = {};
      const event = AWSMock.buildS3Event();

      const action = async () => await S3.getMostRecentFileBody(event);

      expect(action).rejects.toThrow(new MissingEnvironmentError('AWS Variable'));
    });

    it('throws given content type of the file is not text/csv', () => {
      AWSMock.mockS3File('text/text', 'Hi');
      const event = AWSMock.buildS3Event();

      const action = async () => await S3.getMostRecentFileBody(event);

      expect(action).rejects.toThrow(new InvalidFileTypeError('text/csv'));
    });

    it('throws given the response body is not defined', () => {
      AWSMock.mockS3File('text/csv');
      const event = AWSMock.buildS3Event();

      const action = async () => await S3.getMostRecentFileBody(event);

      expect(action).rejects.toThrow(new MissingFileContentError());
    });

    it('returns the file body', async () => {
      const content = "Hi";
      AWSMock.mockS3File("text/csv", content);
      const event = AWSMock.buildS3Event();

      const readable = await S3.getMostRecentFileBody(event);

      const actual = await new Promise((resolve) => {
        const chunks: any = [];
        readable.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        readable.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });

      expect(actual).toBe(content);
    });
  });
});
