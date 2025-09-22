import { POST_BUCKET, POST_BUCKET_URL } from './constants'
import { decode } from 'base64-arraybuffer'

function createRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

export async function uploadImages(uploadClient: any, files: (File | string)[]) {
  let fileUrls: string[] = []

  for (const file of files) {
    const fileName = `image_${createRandomString(10)}.jpg`

    let fileToUpload: File | ArrayBuffer
    if (typeof file === 'string') {
      fileToUpload = decode(file)
    } else {
      fileToUpload = file
    }

    const { data, error } = await uploadClient.storage
      .from(POST_BUCKET)
      .upload(fileName, fileToUpload, { contentType: 'image/jpg', upsert: true })

    if (error) {
      console.error(`error while uploading file: ${error}`)
    } else {
      fileUrls.push(POST_BUCKET_URL + data.path)
    }
  }

  return fileUrls
}
