import fs from "fs";
import path from "path";
import {S3Object} from "aws-sdk/clients/macie2";

const AWS = require('aws-sdk');

// AWS.config.update({
//     region: 'ap-south-1',
//     accessKeyId: 'LSIAQAAAAAAVNCBMPNSG',
//     // secretAccessKey: 'secret'
// });

const s3 = new AWS.S3({
    endpoint: process.env.AWS_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});

export async function copyS3Folder(sourcePrefix: string, destinationPrefix: string, continuationToken?: string): Promise<void> {
    try {
        // List all objects in the source folder
        const listParams = {
            Bucket: process.env.AWS_S3_BUCKET ?? "",
            Prefix: sourcePrefix,
            ContinuationToken: continuationToken
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

        // Copy each object to the new location
        await Promise.all(listedObjects.Contents.map(async (object:S3Object) => {
            if (!object.key) return;
            let destinationKey = object.key.replace(sourcePrefix, destinationPrefix);
            let copyParams = {
                Bucket: process.env.AWS_S3_BUCKET ?? "",
                CopySource: `${process.env.AWS_S3_BUCKET}/${object.key}`,
                Key: destinationKey
            };

            console.log(copyParams);

            await s3.copyObject(copyParams).promise();
            console.log(`Copied ${object.key} to ${destinationKey}`);
        }));

        // Check if the list was truncated and continue copying if necessary
        if (listedObjects.IsTruncated) {
            listParams.ContinuationToken = listedObjects.NextContinuationToken;
            await copyS3Folder(sourcePrefix, destinationPrefix, continuationToken);
        }
    } catch (error) {
        console.error('Error copying folder:', error);
    }
}

export const getFolder = async (key: string, path: string) => {
    try {
        let response = await s3.listObjectsV2({
            Bucket: process.env.AWS_S3_BUCKET,
            Prefix: key
        }).promise();
        if (response.Contents) {
            await Promise.all(response.Contents.map(async (file: S3Object) => {
                const fileKey = file.key;
                if (fileKey) {
                    const getObjectParams = {
                        Bucket: process.env.S3_BUCKET ?? "",
                        Key: fileKey
                    };

                    const data = await s3.getObject(getObjectParams).promise();
                    if (data.Body) {
                        const fileData = data.Body;
                        const filePath = `${path}/${fileKey.replace(key, "")}`;

                        await writeFile(filePath, fileData);

                        console.log(`Downloaded ${fileKey} to ${filePath}`);
                    }
                }
            }));
        }
    } catch (error) {
        console.log("Error fetching folder from S3");
    }
}

function writeFile(filePath: string, fileData: Buffer): Promise<void> {
    return new Promise(async (resolve, reject) => {
        await createFolder(path.dirname(filePath));

        fs.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    });
}

function createFolder(dirName: string) {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(dirName, {recursive: true}, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        });
    })
}




