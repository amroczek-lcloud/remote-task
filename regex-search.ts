import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

import { config } from "dotenv";

config();

const listFilteredS3Files = async (regexFilter: RegExp) => {
  const client = new S3Client({ region: process.env.AWS_REGION });

  const params = { Bucket: process.env.AWS_BUCKET_NAME };
  let continuationToken: string | undefined;
  
  try {
    do {
      const command = new ListObjectsV2Command({
        ...params,
        ContinuationToken: continuationToken,
      });

      const response = await client.send(command);

      if (response.Contents) {
        response.Contents.forEach((item) => {
          if (item.Key && regexFilter.test(item.Key)) {
            console.log(item.Key);
          }
        });
      }

      continuationToken = response.NextContinuationToken;

    } while (continuationToken);

  } catch (error) {
    console.error("Error listing files:", error);
  }
};

const regexFilter = new RegExp(/.txt/);

listFilteredS3Files(regexFilter);
