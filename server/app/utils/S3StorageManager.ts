import AWS from 'aws-sdk';
import { Readable } from 'stream';

class S3StorageManager {
    private static instance: S3StorageManager;
    private s3: AWS.S3;

    private constructor() {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });

        this.s3 = new AWS.S3();
    }

    public static getInstance(): S3StorageManager {
        if (!S3StorageManager.instance) {
            S3StorageManager.instance = new S3StorageManager();
        }

        return S3StorageManager.instance;
    }

    public async uploadFile(bucketName: string, fileName: string, fileContent: Buffer | Readable, contentType: string): Promise<AWS.S3.ManagedUpload.SendData> {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileContent,
            ContentType: contentType
        };

        return this.s3.upload(params).promise();
    }

}

export default S3StorageManager;
