import { POST_BUCKET, POST_BUCKET_URL } from './constants'

function createRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

export async function uploadImage(uploadClient: any, file: any) {
  const fileName = `image_${createRandomString(10)}.jpg`

  const { data, error } = await uploadClient.storage
    .from(POST_BUCKET)
    .upload(fileName, file, { upsert: true })

  if (error) {
    return {
      success: false,
      error: error.message,
      fileUrl: '',
    }
  } else {
    const fileUrl = POST_BUCKET_URL + data.path

    return {
      success: true,
      error: '',
      fileUrl: fileUrl,
    }
  }
}
