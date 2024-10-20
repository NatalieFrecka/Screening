import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ProjectionRepo } from '../repository/projection';
import { FieldGuard } from '../guard/field-guard';
import { InvalidFieldError } from '../error/InvalidFieldError';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const field = event.pathParameters?.field;
  const value = event.queryStringParameters?.value;

  try {
    const matchingProjectionKey = FieldGuard.getNearestProjectionField(field);

    const body = value
      ? await ProjectionRepo.countSingleFieldValue(matchingProjectionKey, value)
      : await ProjectionRepo.countAllFieldValues(matchingProjectionKey);

    return { statusCode: 200, body: JSON.stringify(body), };
  } catch (err) {
    if (err instanceof InvalidFieldError) {
      return { statusCode: 404, body: err.message };
    }

    if(typeof err === 'string') {
      return { statusCode: 500, body: err };
    }

    return { statusCode: 500, body: (err as Error).message };
  }
};

exports.handler = handler;
