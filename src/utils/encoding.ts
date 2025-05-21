/**
 * Encodes an AudioBuffer to a WAV Blob.
 * @param audioBuffer - The AudioBuffer to encode.
 * @returns A Blob containing the WAV data.
 */
export const encodeWAV = (audioBuffer: AudioBuffer): Blob => {
  const buffer = audioBufferToWav(audioBuffer);

  return new Blob([buffer], { type: 'audio/wav' });
};

/**
 * Converts an AudioBuffer to a WAV ArrayBuffer.
 * @param audioBuffer - The AudioBuffer to convert.
 * @param numChannels - The number of channels in the audio buffer.
 * @param sampleRate - The sample rate of the audio buffer.
 * @param bytesPerSample - The number of bytes per sample.
 * @param numSamples - The number of samples in the audio buffer.
 */
export const audioBufferToWav = (
  audioBuffer: AudioBuffer,
  numChannels: number = 1,
  sampleRate: number = audioBuffer.sampleRate,
  bytesPerSample: number = 2,
  numSamples: number = audioBuffer.length,
): ArrayBuffer => {
  const wavSize = 44 + numSamples * bytesPerSample;

  const buffer = new ArrayBuffer(wavSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, wavSize - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * bytesPerSample, true);

  const audioData = audioBuffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.max(-1, Math.min(1, audioData[i]));
    view.setInt16(offset, sample * 0x7fff, true);
    offset += 2;
  }

  return buffer;
};

/**
 * Writes a string to a DataView at a specified offset.
 * @param view - The DataView to write to.
 * @param offset - The offset to write the string at.
 * @param str - The string to write.
 */
const writeString = (view: DataView, offset: number, str: string): void => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
};
