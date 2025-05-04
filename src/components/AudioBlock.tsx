'use client';

import { useEffect, useMemo, useState } from 'react';
import useAudioVisualizer from '@/hooks/useAudioVisualizer';
import { Block } from '@/types/blocks';
import { decodeAudioBuffer } from '@/utils/audio';

interface InputProps {
  block: Block;
  totalBlocksSize: number;
}

export default function AudioBlock({ block, totalBlocksSize }: InputProps) {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const { canvasRef } = useAudioVisualizer(audioBuffer);

  const blockSizePercentage = useMemo(() => {
    return Math.round((block.buffer.byteLength / totalBlocksSize) * 100);
  }, [block.buffer.byteLength, totalBlocksSize]);

  useEffect(() => {
    const fetchAudioBuffer = async () => {
      const buffer = await decodeAudioBuffer(block.buffer);
      setAudioBuffer(buffer);
    };

    fetchAudioBuffer();
  }, [block.buffer]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="h-20 relative flex items-end px-4 pb-2 grow rounded-lg overflow-hidden border-2 border-blue-300 bg-blue-100 cursor-pointer hover:bg-blue-200 transition-colors duration-200"
      style={{ width: `${blockSizePercentage}%` }}
      onMouseDown={handleMouseDown}
    >
      <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0" />
      <p className="text-sm text-[#1a365d] z-20">{block.name}</p>
    </div>
  );
}
