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

export const errorHandler = (e: unknown): Error => {
  if (e instanceof Error) {
    console.error('Caught an Error object:', e.message)
    return e
  } else if (typeof e === 'string') {
    console.error('Caught a string error:', e)
    return new Error(e)
  } else {
    console.error('Caught an unknown error:', e)
    return new Error(`Internal Server Error: ${e}`)
  }
}

export const timeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day ago`

  // fallback for weeks/months
  const weeks = Math.floor(seconds / 604800)
  if (weeks < 4) return `${weeks} week ago`

  const months = Math.floor(seconds / (604800 * 4))
  if (months < 12) return `${months} months ago`

  const years = Math.floor(seconds / (604800 * 52))
  return `${years} years ago`
}
