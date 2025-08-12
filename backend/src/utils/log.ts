import util from 'node:util'

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dateStr = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  const dateFormat = `${year}/${month}/${dateStr}`
  const timeFormat = `${hours}:${minutes}:${seconds}.${milliseconds}`

  return `${dateFormat} ${timeFormat}`;
}

export function log(message?: any): void {
  const date = formatDate(new Date());
  const indent = " ".repeat(date.length)

  if (!message) {
    console.log(date)
    return;
  }

  const result = message.toString().split('\n').map((line: string, index: number) => {
    return `${index ? indent : date} ${line}`
  }).join('\n')

  console.log(result)
  return;
}