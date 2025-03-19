import { formatTime } from '@/utils/time';
import { useMemo } from 'react';

export enum AudioTimeBlockType {
  MAJOR = 'major',
  MINOR = 'minor',
}

export interface AudioTimeBlock {
  type: AudioTimeBlockType;
  time: number;
  label?: string;
}

export default function useAudioTimeBlocks(duration: number) {
  const markers = useMemo(() => {
    const blocks: AudioTimeBlock[] = [];
    if (duration <= 0) return blocks;

    let majorStep;
    if (duration <= 30) {
      majorStep = 1; // markers every second
    } else if (duration <= 120) {
      majorStep = 10; // markers every 10 seconds
    } else if (duration <= 3600) {
      majorStep = 60; // markers every minute
    } else {
      majorStep = 3600; // markers every hour
    }

    const minorCount = 4;

    for (let time = 0; time < duration; time += majorStep) {
      blocks.push({
        type: AudioTimeBlockType.MAJOR,
        time,
        label: formatTime(time),
      });

      if (time + majorStep <= duration) {
        for (let i = 1; i < minorCount; i++) {
          const subTime = time + (i * majorStep) / minorCount;
          blocks.push({
            type: AudioTimeBlockType.MINOR,
            time: subTime,
          });
        }
      }
    }
    return blocks;
  }, [duration]);

  return markers;
}
