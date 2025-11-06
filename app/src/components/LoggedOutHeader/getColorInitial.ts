export function getColorInitial(color: string | undefined): string {
  if (color) return color.charAt(0);
  const colors = ['B', 'G', 'M', 'R', 'T', 'Y'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
