'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppMachineContext } from '@/state-machine/app';
import useAudioVisualizer from '@/hooks/useAudioVisualizer';
import useHandleClickOutside from '@/hooks/useHandleClickOutside';
import { Block } from '@/types/blocks';
import { decodeAudioBuffer } from '@/utils/audio';
import { IoTrashOutline } from 'react-icons/io5';
import { cn } from '@/utils/cn';

interface InputProps {
  block: Block;
  totalBlocksSize: number;
}

export default function AudioBlock({ block, totalBlocksSize }: InputProps) {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const appMachineActorRef = AppMachineContext.useActorRef();

  useHandleClickOutside(containerRef, () => setIsSelected(false));

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    appMachineActorRef.send({
      type: 'event.delete_block',
      blockId: block.id,
    });
  };

  return (
    <div
      className={cn(
        'h-20 group relative flex items-end px-4 pb-2 grow rounded-lg overflow-hidden border-2 border-blue-300 bg-blue-100 cursor-pointer hover:bg-blue-200 transition-colors duration-200',
        isSelected && 'bg-blue-200 border-blue-400',
      )}
      style={{ width: `${blockSizePercentage}%` }}
      onMouseDown={handleMouseDown}
      onClick={() => setIsSelected(!isSelected)}
      ref={containerRef}
    >
      <div
        className={cn(
          'absolute top-0 h-full left-1/2 translate-x-[-50%] w-max hidden items-center justify-center z-40',
          isSelected && 'flex',
        )}
      >
        <button
          className="text-red-500 cursor-pointer hover:text-red-600"
          onClick={handleDeleteClick}
        >
          <IoTrashOutline className="text-3xl" />
        </button>
      </div>
      <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0" />
      <p className="text-sm text-[#1a365d] z-20">{block.name}</p>
    </div>
  );
}
