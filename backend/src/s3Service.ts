import fs from "fs";
import path from "path";
import {S3Object} from "aws-sdk/clients/macie2";
import * as dotenv from "dotenv";
import {TreeNode, createTreeFromPaths} from "./treeNodeService";

dotenv.config();

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    s3ForcePathStyle: true,
});


export async function copyS3Folder(sourcePrefix: string, destinationPrefix: string): Promise<TreeNode[]> {
    try {
        const listParams = {
            Bucket: process.env.AWS_S3_BUCKET ?? "",
            Prefix: sourcePrefix,
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            console.log("base is empty");
        }
        let responseList: string[] = [];
        for (const object of listedObjects.Contents) {
            if (!object.Key) continue;
            const destinationKey = object.Key.replace(sourcePrefix, destinationPrefix);
            const copyParams = {
                Bucket: process.env.AWS_S3_BUCKET ?? "",
                CopySource: `${process.env.AWS_S3_BUCKET}/${object.Key}`,
                Key: destinationKey
            };
            try {
                await s3.copyObject(copyParams).promise();
                console.log(`Copied ${object.Key} to ${destinationKey}`);
                responseList.push(destinationKey);
            } catch (error) {
                console.error(`Error copying ${object.Key} to ${destinationKey}:`, error);
            }
        }
        return createTreeFromPaths(responseList);
    } catch (error) {
        console.error('Error copying folder:', error);
        throw error;
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

export const getFolder = async (key: string, path: string) => {
    try {
        let listedObjects = await s3.listObjectsV2({
            Bucket: process.env.AWS_S3_BUCKET,
            Prefix: key
        }).promise();
        for (const object of listedObjects.Contents) {
            const getObjectParams = {
                Bucket: process.env.AWS_S3_BUCKET ?? '',
                Key: object.Key
            }
            const data = await s3.getObject(getObjectParams).promise();
            if(data.Body) {
                const fileData = data.Body;
                const filePath = `${path}/${object.Key.replace(key, "")}`;
                await writeFile(filePath, fileData);
                console.log(`Download ${object.Key} to ${filePath}`);
            }
        }
    } catch (error) {
        console.log("Error fetching folder from S3", error);
    }
}


