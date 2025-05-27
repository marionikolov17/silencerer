import { audioBufferToWav } from '../utils/encoding';
import ShortTimeEnergyDetector from './short-time-energy';

export interface SilenceSegment {
  start: number;
  end: number;
}

export interface SilencerOptions {
  threshold?: number;
  minimumSilenceDuration?: number;
  frameTime?: number;
  crossfadeDuration?: number;
}

/**
 * This class is used to remove silence from an audio buffer.
 * It uses a threshold to detect silence, a minimum silence duration to determine if a segment is silence,
 * a frame time to determine the size of the frames to process, and a crossfade duration to apply a crossfade transition between segments.
 */
class Silencer {
  private readonly threshold: number;
  private readonly minimumSilenceDuration: number;
  private readonly frameTime: number;
  private readonly crossfadeDuration: number;

  private readonly audioContext: AudioContext;

  constructor(
    threshold: number = 0.01,
    minimumSilenceDuration: number = 0.2,
    frameTime: number = 0.02,
    crossfadeDuration: number = 0.05,
  ) {
    this.threshold = threshold;
    this.minimumSilenceDuration = minimumSilenceDuration;
    this.frameTime = frameTime;
    this.crossfadeDuration = crossfadeDuration;
    this.audioContext = new AudioContext();
  }

  /**
   * Entry point for the silencer.
   * Removes silence from an audio buffer.
   * @param arrayBuffer The audio buffer to remove silence from.
   * @returns A promise that resolves to the audio buffer with silence removed and converted to a WAV buffer.
   */
  public async run(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    const audioBuffer = await this.audioContext.decodeAudioData(
      arrayBuffer.slice(0),
    );

    const segments = await this.detectSilenceSegments(arrayBuffer);
    console.log('Segments detected:', segments);

    const newBuffer = this.removeSilenceSegments(audioBuffer, segments);

    const crossfadedBuffer = await this.applyCrossfadeTransitionBetweenSegments(
      newBuffer,
      segments,
      audioBuffer.sampleRate,
    );

    return audioBufferToWav(crossfadedBuffer);
  }

  /**
   * Removes silence segments from an audio buffer and returns a new audio buffer with the silence removed.
   * @param audioBuffer The audio buffer to remove silence from.
   * @param segments The segments to remove.
   * @returns The audio buffer with silence removed.
   */
  private removeSilenceSegments(
    audioBuffer: AudioBuffer,
    segments: SilenceSegment[],
  ) {
    try {
      const sampleRate = audioBuffer.sampleRate;
      const numberOfChannels = audioBuffer.numberOfChannels;
      const segmentBufferLength = this.calculateSegmentsBufferLength(
        segments,
        sampleRate,
      );

      // Calculate the new buffer length by subtracting silence segments
      const originalLength = audioBuffer.length;
      const newLength = originalLength - segmentBufferLength;

      // Validate the new length is positive
      if (newLength <= 0) {
        throw new Error(
          'Invalid buffer length after removing silence segments',
        );
      }

      // Create a new audio buffer with the same number of channels
      const newBuffer = this.audioContext.createBuffer(
        numberOfChannels,
        newLength,
        sampleRate,
      );

      // Process each channel
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);

        let writeIndex = 0;
        let lastEnd = 0;

        // Copy non-silent segments to the new buffer
        for (const segment of segments) {
          const startSample = Math.floor(segment.start * sampleRate);
          const endSample = Math.floor(segment.end * sampleRate);

          // Validate indices are within bounds
          if (
            startSample < 0 ||
            endSample > originalLength ||
            startSample > endSample
          ) {
            console.warn(
              `Invalid segment indices: start=${startSample}, end=${endSample}, originalLength=${originalLength}`,
            );
            continue;
          }

          // Copy the audio before this silence segment
          const segmentLength = startSample - lastEnd;

          // Validate write operation bounds
          if (writeIndex + segmentLength > newLength) {
            console.warn(
              `Write operation would exceed new buffer length: writeIndex=${writeIndex}, segmentLength=${segmentLength}, newLength=${newLength}`,
            );
            break;
          }

          newData.set(originalData.subarray(lastEnd, startSample), writeIndex);
          writeIndex += segmentLength;
          lastEnd = endSample;
        }

        // Copy any remaining audio after the last silence segment
        if (lastEnd < originalLength) {
          const remainingLength = originalLength - lastEnd;
          if (writeIndex + remainingLength <= newLength) {
            newData.set(originalData.subarray(lastEnd), writeIndex);
          } else {
            console.warn(
              `Remaining audio would exceed new buffer length: writeIndex=${writeIndex}, remainingLength=${remainingLength}, newLength=${newLength}`,
            );
          }
        }
      }

      return newBuffer;
    } catch (error) {
      console.error('Error removing silence segments:', error);
      throw error;
    }
  }

  /**
   * Detects silence segments in an audio buffer.
   * Supports multi-channel audio.
   * @param arrayBuffer The audio buffer to detect silence in.
   * @returns The segments of silence in the audio buffer.
   */
  private async detectSilenceSegments(arrayBuffer: ArrayBuffer) {
    try {
      console.log('Detecting silence segments...');
      const audioBuffer = await this.audioContext.decodeAudioData(
        arrayBuffer.slice(0),
      );

      const shortTimeEnergyDetector = new ShortTimeEnergyDetector(
        audioBuffer,
        this.minimumSilenceDuration,
        this.frameTime,
        this.threshold,
      );

      const segments = await shortTimeEnergyDetector.detectSegments();

      return segments;
    } catch (error) {
      console.error('Error detecting silence segments:', error);
      throw error;
    }
  }

  /**
   * Applies a crossfade transition between silence segments in an audio buffer.
   * @param audioBuffer The audio buffer to apply the crossfade transition to.
   * @param segments The segments to apply the crossfade transition to.
   * @param sampleRate The sample rate of the audio buffer.
   * @returns The audio buffer with the crossfade transition applied.
   */
  private applyCrossfadeTransitionBetweenSegments(
    audioBuffer: AudioBuffer,
    segments: SilenceSegment[],
    sampleRate: number,
  ) {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      sampleRate,
    );

    const source = offlineContext.createBufferSource();
    const gainNode = offlineContext.createGain();

    source.buffer = audioBuffer;

    source.connect(gainNode).connect(offlineContext.destination);

    for (const segment of segments) {
      const startTime = segment.start - this.crossfadeDuration;
      const endTime = segment.start + this.crossfadeDuration;

      gainNode.gain.setValueAtTime(1, startTime);
      gainNode.gain.linearRampToValueAtTime(0, segment.start);
      gainNode.gain.setValueAtTime(0, segment.start);
      gainNode.gain.linearRampToValueAtTime(
        1,
        endTime > audioBuffer.duration ? audioBuffer.duration : endTime,
      );
    }

    source.start(0);

    return offlineContext.startRendering();
  }

  /**
   * Calculates the buffer length of the segments.
   * @param segments The segments to calculate the buffer length of.
   * @param sampleRate The sample rate of the audio buffer.
   * @returns The buffer length of the segments.
   */
  private calculateSegmentsBufferLength(
    segments: SilenceSegment[],
    sampleRate: number,
  ): number {
    return segments.reduce(
      (sum, segment) => sum + (segment.end - segment.start) * sampleRate,
      0,
    );
  }
}

export default Silencer;
