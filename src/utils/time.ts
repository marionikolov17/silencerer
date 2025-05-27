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

export function formatMediaTime(seconds: number, includeFrames = true) {
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 24);

  const pad = (n: number) => n.toString().padStart(2, '0');

  let result = `${pad(minutes)}:${pad(secs)}`;
  if (includeFrames) result += `:${pad(frames)}`;
  return result;
}

export function convertMsToSeconds(ms: number) {
  return ms / 1000;
}

export function convertSecondsToMs(seconds: number) {
  return seconds * 1000;
}
