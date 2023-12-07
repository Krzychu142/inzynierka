import AWS from 'aws-sdk'
import { Readable } from 'stream'

class S3StorageManager {
  private static instance: S3StorageManager
  private s3: AWS.S3

  private constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })

    this.s3 = new AWS.S3()
  }

  public static getInstance(): S3StorageManager {
    if (!S3StorageManager.instance) {
      S3StorageManager.instance = new S3StorageManager()
    }

    return S3StorageManager.instance
  }

  public async uploadFile(
    bucketName: string,
    fileName: string,
    fileContent: Buffer | Readable,
    contentType: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: contentType,
    }

    return this.s3.upload(params).promise()
  }

  public async deleteFileByName(
    bucketName: string,
    fileName: string,
  ): Promise<AWS.S3.DeleteObjectOutput> {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    }

    return this.s3.deleteObject(params).promise()
  }

  public async deleteFileByUrl(
    imageUrl: string,
    bucketName: string,
  ): Promise<AWS.S3.DeleteObjectOutput> {
    const key = this.extractKeyFromUrl(imageUrl, bucketName)

    if (!key) {
      throw new Error('Invalid URL')
    }

    const params = {
      Bucket: bucketName,
      Key: key,
    }

    return this.s3.deleteObject(params).promise()
  }

  private extractKeyFromUrl(url: string, bucketName: string): string | null {
    const pattern = new RegExp(`https://${bucketName}\.s3\..+\.amazonaws\.com/`)
    if (pattern.test(url)) {
      return url.replace(pattern, '')
    }
    return null
  }
}

export default S3StorageManager
