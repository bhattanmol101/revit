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
