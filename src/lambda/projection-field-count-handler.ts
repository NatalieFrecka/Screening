import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { getCountForFieldValue, getCountsForAllFieldValues } from '../utils/column-counters';
import { Projection } from '@prisma/client';

const allowedProjectionFields: (keyof Projection)[] = [
  'attribute',
  'commodity',
  'commodityType',
  'units',
  'yearType',
  'year',
  'value'
];

const getNearestProjectionField = (field?: string): keyof Projection | undefined =>
  allowedProjectionFields.find(key => key.toLowerCase() === field?.toLowerCase());

export const handler = async (e: APIGatewayProxyEventV2) => {
  const field = e.pathParameters?.field;
  const value = e.queryStringParameters?.value;

  const matchingProjectionKey = getNearestProjectionField(field);
  if (!matchingProjectionKey) return { statusCode: 404, body: 'Invalid field name' };

  const body = value
    ? await getCountForFieldValue(matchingProjectionKey, value)
    : await getCountsForAllFieldValues(matchingProjectionKey);

  return { statusCode: 200, body: JSON.stringify(body), };
};

exports.handler = handler;
