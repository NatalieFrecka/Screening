import { S3Event } from 'aws-lambda';
import { S3 } from '../S3/S3-file-handler';
import { CSV } from '../file-utils/csv-parser';
import { ProjectionRow } from '../types/ProjectionRow';
import { ProjectionRowTransformer } from '../transformations/projection-row';
import { ProjectionRepo } from '../repository/projection';
import { MissingFileContentError } from '../error/MissingFileContentError';
import { InvalidFileTypeError } from '../error/InvalidFileTypeError';

export const handler = async (event: S3Event) => {
  try {
    const body = await S3.getMostRecentFileBody(event);
    const rows = await CSV.parse<ProjectionRow>(body);
    const projectionsToWrite = rows.map(ProjectionRowTransformer.toProjection);
    await ProjectionRepo.insertMany(projectionsToWrite);

    return { statusCode: 200 };
  } catch (err) {
    if (err instanceof InvalidFileTypeError) {
      return { statusCode: 400, body: err.message };
    }

    if (err instanceof MissingFileContentError) {
      return { statusCode: 400, body: err.message };
    }

    if (typeof err === 'string') {
      return { statusCode: 500, body: err };
    }

    return { statusCode: 500, body: (err as Error).message };
  }
};
