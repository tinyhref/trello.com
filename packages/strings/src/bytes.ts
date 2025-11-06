// Take a number like 9823 and convert it to "9.59 KB"
export function bytes(numBytes: number | null | undefined) {
  if (typeof numBytes !== 'number') {
    return 'Unknown Size';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let count = numBytes;
  for (let i = 0; i < units.length; i++) {
    if (count < 1024 || i === units.length - 1) {
      numBytes = Math.round(count * 100) / 100;
      return `${numBytes} ${units[i]}`;
    }
    count /= 1024;
  }
}
