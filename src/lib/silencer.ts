import { normalizeAudio } from '../utils/normalization';
import { audioBufferToWav } from '../utils/encoding';

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

      const sampleRate = audioBuffer.sampleRate;
      const numberOfChannels = audioBuffer.numberOfChannels;

      const frameSize = Math.floor(sampleRate * this.frameTime);

      const channelSegments =
        this.createChannelsSegmentsObject(numberOfChannels);

      // Support multi-channel audio
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = normalizeAudio(audioBuffer.getChannelData(channel));

        const segments: SilenceSegment[] = [];
        let silentFrames = 0;
        let startTime = 0;
        let endTime = 0;

        for (let i = 0; i < channelData.length; i += frameSize) {
          const frame = channelData.slice(i, i + frameSize);
          const energy = this.calculateEnergy(frame);

          if (energy < this.threshold) {
            if (startTime === 0) {
              startTime = i / sampleRate;
            }
            silentFrames++;
          } else {
            if (endTime === 0) endTime = i / sampleRate;
            if (silentFrames >= this.minimumSilenceDuration * sampleRate) {
              segments.push({
                start: startTime,
                end: endTime,
              });
            }
            silentFrames = 0;
            startTime = 0;
            endTime = 0;
          }
        }

        // When going to the end of the audio, if there is still silence, add a segment
        if (silentFrames > 0) {
          segments.push({
            start: startTime,
            end: audioBuffer.duration,
          });
        }

        // Add the segments to the channel's segments array
        channelSegments[channel] = segments;
      }

      return this.mergeChannelsSegments(channelSegments);
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
   * Merges the segments of silence from different channels into a single array of silence segments.
   * @param channelSegments The segments of silence from different channels.
   * @returns The merged segments of silence.
   */
  private mergeChannelsSegments(
    channelSegments: Record<number, SilenceSegment[]>,
  ): SilenceSegment[] {
    const mergedSegments: SilenceSegment[] = [];

    const firstChannelSegments = channelSegments[0];

    for (const segment of firstChannelSegments) {
      const start = segment.start;
      const end = segment.end;

      let matchingSegments = 0;

      for (
        let channel = 1;
        channel < Object.keys(channelSegments).length;
        channel++
      ) {
        const segments = channelSegments[channel];

        const overlappingSegment = segments.find(
          (s) => s.start === start && s.end === end,
        );

        if (overlappingSegment) {
          matchingSegments++;
        }
      }

      if (matchingSegments === Object.keys(channelSegments).length - 1) {
        mergedSegments.push({
          start,
          end,
        });
      }
    }

    return mergedSegments;
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

  /**
   * Calculates the energy of a frame.
   * @param frame The frame to calculate the energy of.
   * @returns The energy of the frame.
   */
  private calculateEnergy(frame: Float32Array): number {
    const energy = frame.reduce((sum, sample) => sum + sample * sample, 0);
    return energy / frame.length;
  }

  /**
   * Creates a record of segments for each channel.
   * @param numberOfChannels The number of channels in the audio buffer.
   * @returns A record of segments for each channel.
   */
  private createChannelsSegmentsObject(
    numberOfChannels: number,
  ): Record<number, SilenceSegment[]> {
    const channelSegments: Record<number, SilenceSegment[]> = {};
    for (let channel = 0; channel < numberOfChannels; channel++) {
      channelSegments[channel] = [];
    }
    return channelSegments;
  }
}

export default Silencer;
