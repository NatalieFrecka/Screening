// import * as aws from "@pulumi/aws";
//
// const lambda = new aws.lambda.Function("histogramLambda", {
//   runtime: aws.lambda.NodeJS14dXRuntime,
//   handler: "index.handler",
//   code: new pulumi.asset.AssetArchive({
//     ".": new pulumi.asset.FileArchive("../src/lambda/projection-field-count-handler.ts"),
//   }),
//   // role: iamRole.arn,
// });
//
// const api = new aws.apigatewayv2.Api("screeningApi", { protocolType: "HTTP" });
//
// const integration = new aws.apigatewayv2.Integration("lambdaIntegration", {
//   apiId: api.id,
//   integrationType: "AWS_PROXY",
//   integrationUri: lambda.arn,
//   payloadFormatVersion: "2.0",
// });
//
// const route = new aws.apigatewayv2.Route("lambdaRoute", {
//   apiId: api.id,
//   routeKey: "GET /{id}/histogram",
//   target: pulumi.interpolate`integrations/${integration.id}`,
// });
//
// const stage = new aws.apigatewayv2.Stage("devStage", {
//   apiId: api.id,
//   name: "dev",
//   autoDeploy: true,
// });
//
// // Output the API URL
// export const url = pulumi.interpolate`${api.apiEndpoint}/{id}/histogram`;
