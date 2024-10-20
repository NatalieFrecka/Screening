import { S3Event } from 'aws-lambda';
import { S3 } from '../S3/S3-file-handler';
import { CSV } from '../file-utils/csv-parser';
import { ProjectionRow } from '../types/ProjectionRow';
import { ProjectionRowTransformer } from '../transformations/projection-row';
import { ProjectionRepo } from '../repository/projection';

export const handler = async (event: S3Event) => {
  try {
    const body = await S3.getMostRecentFileBody(event);
    const rows = await CSV.parse<ProjectionRow>(body);
    const projectionsToWrite = rows.map(ProjectionRowTransformer.toProjection);
    await ProjectionRepo.upsertMany(projectionsToWrite);

    return { statusCode: 200 };
  } catch (err) {
    return { statusCode: 500, message: (err as Error).message };
  }
};

exports.handler = handler;

