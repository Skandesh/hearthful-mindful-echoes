
// Return a soothing color from the palette
export function getRandomSoothingColor(): string {
  const colors = [
    'rgba(155, 135, 245, 0.6)', // Soft Purple
    'rgba(126, 105, 171, 0.5)', // Muted Purple
    'rgba(214, 188, 250, 0.4)', // Light Purple
    'rgba(229, 222, 255, 0.5)', // Softer Purple
    'rgba(242, 252, 226, 0.4)', // Soft Green
    'rgba(254, 247, 205, 0.5)', // Soft Yellow
    'rgba(156, 198, 233, 0.5)', // Soft Blue
    'rgba(214, 234, 248, 0.4)', // Lighter Blue
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
