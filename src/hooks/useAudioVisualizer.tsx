'use client';

import { useEffect, useRef } from 'react';
import useWaveformGenerator from './useWaveformGenerator';

export default function useAudioVisualizer(
  audioBuffer: AudioBuffer | undefined | null,
) {
  const { waveform, processAudioBuffer } = useWaveformGenerator();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!audioBuffer) return;
    processAudioBuffer(audioBuffer);
  }, [audioBuffer, processAudioBuffer]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (waveform.length === 0 || !audioBuffer) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    canvas.width = window.innerWidth * 0.9;
    canvas.height = 200;

    const width = canvas.width;
    const height = canvas.height;
    const middle = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);

    const maxVal = Math.max(...waveform.map((v) => Math.abs(v)));
    const normalizationFactor = maxVal > 0 ? maxVal : 1;

    const defaultColor = '#8ec5ff';
    let currentColor = defaultColor;

    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 1;

    waveform.forEach((value, index) => {
      const x = (index / waveform.length) * width;
      const normalizedValue = value / normalizationFactor;
      const y = middle + normalizedValue * middle;

      if (defaultColor !== currentColor) {
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = defaultColor;
        currentColor = defaultColor;
        ctx.moveTo(x, y);
      } else {
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [waveform, audioBuffer]);

  return { canvasRef };
}
