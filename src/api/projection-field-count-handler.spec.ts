import { TestingFactory } from '../../testing/factory';
import { ProjectionValue } from '../types/ProjectionAliases';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from './projection-field-count-handler';

describe('ProjectionFieldCountHandler', () => {
  beforeEach(() => {
    TestingFactory.insertProjection({ commodity: 'Rice', commodityType: 'Crops' });
    TestingFactory.insertProjection({ commodity: 'Rice', commodityType: 'Crops' });
    TestingFactory.insertProjection({ commodity: 'Barley', commodityType: 'Crops' });
  });

  it('returns a 404 given field is missing from the path parameters', async () => {
    const event = buildEvent();

    const response = await handler(event);

    expect(response.statusCode).toBe(404);
  });

  it('returns a 404 given field is not a valid key of projection', async () => {
    const event = buildEvent('INVALID');

    const response = await handler(event);

    expect(response.statusCode).toBe(404);
  });

  it('returns counts for all values of field given no value is provided', async () => {
    const field = 'commodity';
    const event = buildEvent(field);

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body!)).toEqual([
      TestingFactory.buildFieldCount(field, 'Barley'),
      TestingFactory.buildFieldCount(field, 'Rice', 2),
    ]);
  });

  it('returns count only for value provided', async () => {
    const field = 'commodity';
    const value = 'Rice';
    const event = buildEvent(field, value);

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body!)).toEqual(TestingFactory.buildFieldCount(field, value, 2));
  });

  it('figures out the Projection field regardless of case', async () => {
    const value = 'Crops';
    const event = buildEvent('CommodityType', value);

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body!)).toEqual(TestingFactory.buildFieldCount("commodityType", value, 3));
  });

  const buildEvent = (field?: string, value?: ProjectionValue): APIGatewayProxyEventV2 => ({
    pathParameters: { field },
    queryStringParameters: { value }
  }) as unknown as APIGatewayProxyEventV2;

});
