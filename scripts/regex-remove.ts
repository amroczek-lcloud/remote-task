import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

import { config } from 'dotenv';

config();

const deleteFilteredS3Files = async (regexFilter: RegExp) => {
  const client = new S3Client({ region: process.env.AWS_REGION });

  const params = { Bucket: process.env.AWS_BUCKET_NAME };
  let continuationToken: string | undefined;
  
  try {
    do {
      const listCommand = new ListObjectsV2Command({
        ...params,
        ContinuationToken: continuationToken,
      });

      const response = await client.send(listCommand);

      const objectsToDelete = response.Contents?.filter(
        (item) => item.Key && regexFilter.test(item.Key)
      ).map(item => ({ Key: item.Key })) || [];

      if (objectsToDelete.length > 0) {
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Delete: {
            Objects: objectsToDelete,
            Quiet: true
          }
        };

        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await client.send(deleteCommand);

        console.log(`Deleted ${objectsToDelete.length} objects from ${process.env.AWS_BUCKET_NAME}`);
      }

      continuationToken = response.NextContinuationToken;

    } while (continuationToken);

  } catch (error) {
    console.error('Error deleting files:', error);
  }
};

const regexFilter = /.txt/;

deleteFilteredS3Files(regexFilter);
