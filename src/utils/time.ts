export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h`;
  } else if (hours <= 0 && minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}
