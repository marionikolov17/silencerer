'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface RangeControllerProps {
  min: number;
  max: number;
  updateValue: (value: number) => void;
  className?: string;
  backgroundColorClassName?: string;
  backgroundColor?: string;
  fillColorClassName?: string;
  fillColor?: string;
  pointerBorderColorClassName?: string;
  pointerBorderColor?: string;
  pointerColorClassName?: string;
  pointerColor?: string;
}

export default function RangeController({
  min,
  max,
  updateValue,
  className = 'w-40',
  backgroundColorClassName = 'bg-gray-200',
  backgroundColor,
  fillColorClassName = 'bg-blue-500',
  fillColor,
  pointerBorderColorClassName = 'border-blue-500',
  pointerBorderColor,
  pointerColorClassName = 'bg-white',
  pointerColor,
}: RangeControllerProps) {
  // State
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const parentRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  // Utils
  const updateProgress = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    element: HTMLDivElement,
  ) => {
    const { left, width } = element.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newLeft = clientX - left;
    const newProgress = (newLeft / width) * 100;
    setProgress(Math.min(Math.max(newProgress, 0), 100));
  };

  // Handlers
  const handleParentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (parentRef.current) {
      updateProgress(e, parentRef.current);
    }
  };

  const handlePointerOnMouseDown = () => {
    setIsDragging(true);
  };

  const handlePointerOnMouseUp = () => {
    setIsDragging(false);
  };

  const handlePointerOnMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && pointerRef.current && parentRef.current) {
      updateProgress(e, parentRef.current);
    }
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && parentRef.current) {
      updateProgress(e, parentRef.current);
    }
  };

  // Effects
  useEffect(() => {
    updateValue(calculateValue(min, max, progress));
  }, [progress, min, max, updateValue]);

  return (
    <div className={cn('w-40 h-full relative flex items-center', className)}>
      <div
        className={cn('w-full h-0.5', backgroundColorClassName)}
        style={{ backgroundColor: backgroundColor || undefined }}
        ref={parentRef}
        onClick={handleParentClick}
      >
        <div
          className={cn('h-full', fillColorClassName)}
          style={{
            backgroundColor: fillColor || undefined,
            width: `${progress}%`,
          }}
        ></div>
      </div>
      <div
        className={cn(
          'absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-4 h-4 border-3 border-blue-500 bg-white cursor-pointer',
          pointerBorderColorClassName,
          pointerColorClassName,
        )}
        style={{
          borderColor: pointerBorderColor || undefined,
          backgroundColor: pointerColor || undefined,
          left: `${progress}%`,
        }}
        ref={pointerRef}
        onMouseDown={handlePointerOnMouseDown}
        onMouseUp={handlePointerOnMouseUp}
        onMouseMove={handlePointerOnMouseMove}
        onMouseLeave={handlePointerOnMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      ></div>
    </div>
  );
}

export function calculateValue(min: number, max: number, progress: number) {
  return (progress / 100) * (max - min) + min;
}
