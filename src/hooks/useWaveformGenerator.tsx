'use client';

import { useCallback, useState } from 'react';

const useWaveformGenerator = () => {
  const [waveform, setWaveform] = useState<number[]>([]);

  const processAudioBuffer = useCallback((audioBuffer: AudioBuffer) => {
    if (!audioBuffer) return setWaveform([]);

    try {
      const rawData = audioBuffer.getChannelData(0);
      const sampleRate = 48000;
      const step = Math.floor(rawData.length / sampleRate);
      const waveformData: number[] = [];

      for (let i = 0; i < sampleRate; i++) {
        const index = i * step;
        waveformData.push(rawData[index]);
      }

      setWaveform(waveformData);
    } catch (error) {
      console.error('Error processing audio buffer:', error);
    }
  }, []);

  return { waveform, processAudioBuffer };
};

export default useWaveformGenerator;
