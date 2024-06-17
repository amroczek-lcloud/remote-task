import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

import { config } from 'dotenv';

config();

const listS3Files = async () => {
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

      response.Contents?.forEach((item) => {
        console.log(item.Key);
      });

      continuationToken = response.NextContinuationToken;

    } while (continuationToken);

  } catch (error) {
    console.error('Error listing files:', error);
  }
};

listS3Files();
