import { SilenceSegment } from '@/lib/silencer';

/**
 * Utility class for handling audio channels.
 */
class Channel {
  /**
   * Merges the segments of silence from different channels into a single array of silence segments.
   * @param channelSegments The segments of silence from different channels.
   * @returns The merged segments of silence.
   */
  public static mergeChannelsSegments(
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
   * Creates a record of segments for each channel.
   * @param numberOfChannels The number of channels in the audio buffer.
   * @returns A record of segments for each channel.
   */
  public static createChannelsSegmentsObject(
    numberOfChannels: number,
  ): Record<number, SilenceSegment[]> {
    const channelSegments: Record<number, SilenceSegment[]> = {};
    for (let channel = 0; channel < numberOfChannels; channel++) {
      channelSegments[channel] = [];
    }
    return channelSegments;
  }
}

export default Channel;
