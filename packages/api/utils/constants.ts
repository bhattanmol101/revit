export const POST_LIMIT = 5

export const QR_CODE_GEN_URL = 'http://api.qrserver.com/v1/create-qr-code'

export const REVITAPP_URL = 'https://revitapp.in'

export const INDUSTRIES = [
  { key: 'fnb', label: 'Food & Beverage' },
  { key: 'hospitality', label: 'Hospitality' },
  { key: 'travel', label: 'Tour & Travel' },
  { key: 'influencer', label: 'Influencer' },
  { key: 'sports', label: 'Sports & Fitness' },
]

export const PRICE_PP = [
  { key: 1, label: '100-300' },
  { key: 2, label: '500-800' },
  { key: 3, label: '900-1200' },
  { key: 4, label: '1300-1600' },
  { key: 5, label: '1700-2000' },
  { key: 6, label: '2000-3000' },
  { key: 7, label: '3000+' },
]

export const VISIT = [
  { key: 1, label: 'Breakfast' },
  { key: 2, label: 'Lunch' },
  { key: 3, label: 'High Tea' },
  { key: 4, label: 'Dinner' },
]

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong, Please retry!'

export const EMPTY_REVIEW_ERROR_MESSAGE =
  'You are going to give this post 0 rating, please press send again to confirm!'

export const EMPTY_BUSINESS_REVIEW_ERROR_MESSAGE =
  'You are going to give this business 0 rating, please press next again to confirm!'

export const POST_MAX_FILE_LIMIT = 5

export const POST_MAX_FILE_SIZE = 2 * 1000 * 1024

export const INDUSTRIES_MAPPER = new Map<String, String>([
  ['fnb', 'Food & Beverage'],
  ['hospitality', 'Hospitality'],
  ['it', 'Information Technoloy'],
  ['travel', 'Tour & Travel'],
  ['influencer', 'Influencer'],
  ['news', 'News'],
  ['music', 'Music'],
  ['sports', 'Sports & Fitness'],
])

export const LABEL_MAPPER = new Map<String, String>([
  ['food', 'Food'],
  ['service', 'Service'],
  ['ambiance', 'Ambiance'],
  ['vibe', 'Vibe'],
  ['servicePerson', 'Service Person'],
  ['pricePP', 'Price Per Person'],
])
