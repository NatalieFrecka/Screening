import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as rds from '@aws-cdk/aws-rds';
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

export class ServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const csvBucket = new s3.Bucket(this, 'CsvBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Ad VPC
    const db = new rds.ServerlessCluster(this, 'PostgresDB', {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      defaultDatabaseName: 'mydatabase',
      scaling: { autoPause: cdk.Duration.minutes(10) },
    });

    const csvParserRole = new iam.Role(this, 'CsvParserLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    db.grantDataApiAccess(csvParserRole);
    csvBucket.grantRead(csvParserRole);

    const csvParserLambda = new lambda.Function(this, 'CsvParserLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/csv-parser'),
      handler: 'index.handler',
      role: csvParserRole,
      environment: {
        BUCKET_NAME: csvBucket.bucketName,
        DB_SECRET_ARN: db.secret?.secretArn || '',
        DB_NAME: 'mydatabase',
      },
    });

    csvParserLambda.addEventSource(
      new S3EventSource(csvBucket, {
        events: [s3.EventType.OBJECT_CREATED],
        filters: [{ suffix: '.csv' }],
      })
    );

    const histogramRole = new iam.Role(this, 'HistogramLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    db.grantDataApiAccess(histogramRole);

    const histogramLambda = new lambda.Function(this, 'HistogramLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/histogram'),
      handler: 'index.handler',
      role: histogramRole,
      environment: {
        DB_SECRET_ARN: db.secret?.secretArn || '',
        DB_NAME: 'mydatabase',
      },
    });

    const api = new apigateway.RestApi(this, 'HistogramApi', {
      restApiName: 'Histogram Service',
      description: 'This service serves histograms.',
    });

    const histogramResource = api.root.addResource('{field}');
    const getHistogramIntegration = new apigateway.LambdaIntegration(histogramLambda);
    histogramResource.addMethod('GET', getHistogramIntegration);
  }
}
