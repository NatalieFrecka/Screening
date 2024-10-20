## Requirements

- Docker
- Docker compose
- Node 20
- yarn

## Install

Run `yarn install`

## Testing

Run `yarn test`

## Prisma

Run `yarn generate-client` to generate types

## Running locally

After installing and making sure docker is running, run `yarn start`. This will start all the docker containers and
perform the schema migrations on the db. It will also start a localstack and setup/populate the s3 bucket with the
Projection2021.csv file in the testing dir.

Run `yarn csv-parser:trigger` to send an S3 event to the csv parser lambda. This will populate the db.

You can run `curl "http://localhost/{field}/histogram"` to get data on any of the headers in the Projections2021 csv
file. Ex `curl "http://localhost/Commodity/histogram"`. You can also add the optional value parameter to get data on
that specific value. `curl "http://localhost/{field}/histogram?value={value}"` Ex.
`curl "http://localhost/Commodity/histogram?value=Rice"`
