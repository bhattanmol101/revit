
export const getPostDateString = (date: Date) => {
    return `${date.getUTCDate()} ${MONTH_CONVERTER.get(date.getUTCMonth())}, ${date.getFullYear()}`
}

export const getJoingDateString = (date: Date) => {
    return `${MONTH_CONVERTER.get(date.getUTCMonth())}, ${date.getFullYear()}`
}

export const MONTH_CONVERTER = new Map<number, string>([
    [0, "Jan"],
    [1, "Feb"],
    [2, "Mar"],
    [3, "Apr"],
    [4, "May"],
    [5, "Jun"],
    [6, "Jul"],
    [7, "Aug"],
    [8, "Sept"],
    [9, "Oct"],
    [10, "Nov"],
    [11, "Dec"],
]);