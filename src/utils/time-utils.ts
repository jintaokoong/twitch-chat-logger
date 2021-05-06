export const getDate = (date: Date) => {
  return `${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDate()}`;
};