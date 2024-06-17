import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

import { config } from "dotenv";

config();

const listS3Files = async () => {
  const client = new S3Client({ region: process.env.AWS_REGION });

  const command = new ListObjectsV2Command({ Bucket: process.env.AWS_BUCKET_NAME });

  try {
    const response = await client.send(command);
    if (response.Contents) {
      console.log("Files in the bucket:");
      response.Contents.forEach((item) => {
        console.log(item.Key);
      });
    } else {
      console.log("No files found in the bucket.");
    }
  } catch (error) {
    console.error("Error listing files:", error);
  }
};

listS3Files();
