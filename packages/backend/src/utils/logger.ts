import util from 'node:util'

function formatDate(date: Date, type?: string): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dateStr = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  const dateFormat = `${year}/${month}/${dateStr}`
  const timeFormat = `${hours}:${minutes}:${seconds}.${milliseconds}`

  return `[${dateFormat} ${timeFormat}${type ? ` ${type}` : ""}]`;
}

export function info(message?: any): void {
  const date = formatDate(new Date(), "INFO");

  console.log(util.format(date, message))
  return;
}

export function error(message?: any): void {
  const date = formatDate(new Date(), "ERR!");

  console.log(util.format(date, message))
  return;
}

export default {
  info, error
}