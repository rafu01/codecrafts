import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    // endpoint: process.env.AWS_ENDPOINT,
    s3ForcePathStyle: true,
});

async function fetchObjects(sourcePrefix: string) {
    const listParams = {
        Bucket: process.env.AWS_S3_BUCKET ?? "",
        Prefix: sourcePrefix,
    };

    return await s3.listObjectsV2(listParams).promise();
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

function getPath(filePath: string, codeFolderLength: number) {
    return path.join(`/workspace', ${filePath.substring(codeFolderLength)}`);
}

export function writeToFile(filePath: string, fileData: string):Promise<void> {
    return new Promise(async (resolve, reject) => {
        let codeFolderLength = `${process.env.CODE_FOLDER}`.length;
        fs.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
        await uploadToS3(filePath, fileData);
    });
}

async function uploadToS3(filePath: string, fileData: string) {
    const putObjectParams = {
        Bucket: process.env.AWS_S3_BUCKET ?? "",
        Key: filePath,
        Body: fileData,
        ContentType: 'text/plain'
    }
    try {
       await s3.putObject(putObjectParams).promise();
    }
    catch (err) {
        console.log("error uploading file", err);
    }
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

export const copyToLocal = async (key: string, path: string) => {
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
                const filePath = `${path}${object.Key.replace(key, "")}`;
                await writeFile(filePath, fileData);
                console.log(`Download ${object.Key} to ${filePath}`);
            }
        }
    } catch (error) {
        console.log("Error fetching folder from S3", error);
    }
}

export const getFileContents = async (filePath: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        let codeFolderLength = `${process.env.CODE_FOLDER}`.length;
        fs.readFile(filePath, 'utf-8',  (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

export const checkIfIdExists = async (id: string): Promise<boolean> => {
    try {
        const headObjectParams = {
            Bucket: process.env.AWS_S3_BUCKET ?? "",
            Prefix: `${process.env.CODE_FOLDER}${id}`,
        };
        let listObjects = await s3.listObjectsV2(headObjectParams).promise();
        return listObjects.Contents.length > 0;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

