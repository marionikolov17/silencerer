import { normalizeAudio } from '@/utils/normalization';
import { SilenceSegment } from './silencer';
import Channel from '@/utils/channel';

/**
 * Detects silence segments in an audio buffer using the Short-Time Energy (STE) method.
 * @param audioBuffer The audio buffer to detect silence segments in.
 * @param minimumSilenceDuration The minimum duration of silence to detect.
 * @param frameTime The time of each frame.
 * @param threshold The threshold for detecting silence.
 * @param frameSize The size of each frame.
 * @param sampleRate The sample rate of the audio buffer.
 * @param numberOfChannels The number of channels in the audio buffer.
 * @see https://www.ripublication.com/ijaer23/ijaerv19n2_01.pdf
 */
class ShortTimeEnergyDetector {
  private readonly frameTime: number;
  private readonly frameSize: number;
  private readonly threshold: number;
  private readonly minimumSilenceDuration: number;
  private readonly audioBuffer: AudioBuffer;
  private readonly sampleRate: number;
  private readonly numberOfChannels: number;

  constructor(
    audioBuffer: AudioBuffer,
    minimumSilenceDuration: number = 0.5,
    frameTime: number = 0.05,
    threshold: number = 0.02,
  ) {
    this.audioBuffer = audioBuffer;
    this.sampleRate = audioBuffer.sampleRate;
    this.numberOfChannels = audioBuffer.numberOfChannels;
    this.frameTime = frameTime;
    this.frameSize = Math.floor(this.sampleRate * this.frameTime);
    this.threshold = threshold;
    this.minimumSilenceDuration = minimumSilenceDuration;
  }

  /**
   * Detects the silence segments in the audio buffer.
   * Uses the Short-Time Energy (STE) method to detect silence segments.
   * @returns The silence segments.
   */
  public async detectSegments(): Promise<SilenceSegment[]> {
    try {
      console.log('Detecting silence segments...', this.minimumSilenceDuration);

      const channelSegments = Channel.createChannelsSegmentsObject(
        this.numberOfChannels,
      );

      // Support multi-channel audio
      for (let channel = 0; channel < this.numberOfChannels; channel++) {
        const channelData = normalizeAudio(
          this.audioBuffer.getChannelData(channel),
        );

        const segments: SilenceSegment[] = [];
        let silentFrames = 0;
        let startTime = 0;
        let endTime = 0;

        for (let i = 0; i < channelData.length; i += this.frameSize) {
          const frame = channelData.slice(i, i + this.frameSize);
          const energy = this.calculateEnergy(frame);

          if (energy < this.threshold) {
            if (startTime === 0) {
              startTime = i / this.sampleRate;
            }
            silentFrames++;
          } else {
            if (endTime === 0) endTime = i / this.sampleRate;
            if (
              silentFrames * this.frameSize >=
              this.minimumSilenceDuration * this.sampleRate
            ) {
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
            end: this.audioBuffer.duration,
          });
        }

        // Add the segments to the channel's segments array
        channelSegments[channel] = segments;
      }

      console.log('channelSegments', channelSegments);

      return Channel.mergeChannelsSegments(channelSegments);
    } catch (error) {
      console.error('Error detecting silence segments:', error);
      throw error;
    }
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
}

export default ShortTimeEnergyDetector;
