import { getDate } from './time-utils'

export const getLogName = (channel: string, date: Date) => {
  const fullDate = getDate(date);
  const p = channel.replace('#', '');
  return `${p}_${fullDate}.log`;
}