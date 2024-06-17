import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import * as fs from "fs";

import { config } from "dotenv";

config();

const uploadFileToS3 = async (filePath: string, destinationKey: string) => {
  const client = new S3Client({ region: process.env.AWS_REGION });

  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: destinationKey,
    Body: fileStream,
  };

  try {
    const parallelUploads3 = new Upload({
      client,
      params: uploadParams,
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    await parallelUploads3.done();
    console.log(`File uploaded successfully to ${process.env.AWS_BUCKET_NAME}/${destinationKey}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const filePath = "./to-upload.txt";
const destinationKey = "uploaded/to-upload.txt";

uploadFileToS3(filePath, destinationKey);
