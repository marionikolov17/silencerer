/**
 * Normalizes audio data to have a maximum amplitude of 1.0
 * @param audioData The audio data to normalize
 * @returns Normalized audio data
 */
export function normalizeAudio(audioData: Float32Array): Float32Array {
  const maxAmplitude = findMaxAmplitude(audioData);

  const normalizedData = audioData.slice();
  for (let i = 0; i < normalizedData.length; i++) {
    normalizedData[i] /= maxAmplitude;
  }

  return normalizedData;
}

/**
 * Finds the maximum amplitude in the audio data.
 * @param audioData The audio data to find the maximum amplitude of.
 * @returns The maximum amplitude in the audio data.
 */
function findMaxAmplitude(audioData: Float32Array): number {
  let maxAmplitude = 0;
  for (let i = 0; i < audioData.length; i++) {
    const absValue = Math.abs(audioData[i]);
    if (absValue > maxAmplitude) {
      maxAmplitude = absValue;
    }
  }
  return maxAmplitude;
}
