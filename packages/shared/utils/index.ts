export function getJoinedDate(date: Date) {
  // Use Intl.DateTimeFormat for localized month and year
  const options = { year: 'numeric', month: 'long' }
  const formatter = new Intl.DateTimeFormat('en-US', options) // 'en-US' for English month names

  const formattedDate = formatter.format(date)

  return `${formattedDate}`
}
