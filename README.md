# remote-task

Please create `.env` file in the root directory based on the `.env.example` file.

## List all files in an S3 Bucket

Run `npx ts-node ./scripts/list-all.ts`

## Upload a local file to a defined location in the bucket

Run `npx ts-node ./scripts/upload-local-file.ts`

## List an AWS buckets files that match a "filter" regex 

Run `npx ts-node ./scripts/regex-search.ts`

## Delete all files matching a regex from a bucket

Run `npx ts-node ./scripts/regex-remove.ts`
