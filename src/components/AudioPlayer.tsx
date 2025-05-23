'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AiFillBackward, AiFillForward } from 'react-icons/ai';
import { IoCutOutline, IoPause, IoPlay } from 'react-icons/io5';
import AudioBlock from './AudioBlock';
import useAudioTimeBlocks, {
  AudioTimeBlockType,
} from '@/hooks/useAudioTimeBlocks';
import { Block } from '@/types/blocks';
import { fetchAudioFromBlocks } from '@/utils/audio';
import { cn } from '@/utils/cn';
import { formatMediaTime } from '@/utils/time';
import { usePlayer } from '@/contexts/player';
import { AppMachineContext } from '@/state-machine/app';
import SilenceRemovalScreen from './SilenceRemovalScreen';
interface InputProps {
  blocks: Block[];
}

export default function AudioPlayer({ blocks }: InputProps) {
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isFetchingAudio, setIsFetchingAudio] = useState(false);
  const [markersWidth, setMarkersWidth] = useState(0);

  const isRemovingSilence = AppMachineContext.useSelector(
    (state) => state.context.isRemovingSilence,
  );

  const markersRef = useRef<HTMLDivElement>(null);

  const appMachineActorRef = AppMachineContext.useActorRef();

  const totalBlocksSize = useMemo(() => {
    return blocks.reduce((acc, block) => acc + block.buffer.byteLength, 0);
  }, [blocks]);

  const markers = useAudioTimeBlocks(duration);

  const {
    isPlaying,
    timeDisplayRef,
    timelineRef,
    seekerRef,
    audioRef,
    handlePlayAndPause,
    handleFrameNavigation,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = usePlayer();

  // Fetch audio
  useEffect(() => {
    const fetchAudio = async () => {
      if (blocks.length === 0) {
        setAudioUrl(null);
        setDuration(0);
        return;
      }

      setIsFetchingAudio(true);

      try {
        const { blob, buffer } = await fetchAudioFromBlocks(blocks);

        const url = URL.createObjectURL(blob);

        setAudioUrl(url);
        setDuration(buffer.duration);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingAudio(false);
      }
    };

    fetchAudio();
  }, [blocks]);

  // Set markers width
  useEffect(() => {
    const handleResize = () => {
      setMarkersWidth(markersRef.current?.clientWidth ?? 0);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSilenceRemove = () => {
    appMachineActorRef.send({ type: 'event.silence_remove' });
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col pb-2 z-50 bg-white select-none',
        isFetchingAudio && 'opacity-50 pointer-events-none',
      )}
    >
      <audio ref={audioRef} src={audioUrl ?? undefined} className="hidden" />
      <div className="w-full h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            title="Silence Remove"
            className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-lg"
            disabled={!audioUrl || isRemovingSilence}
            onClick={handleSilenceRemove}
          >
            <IoCutOutline className="text-2xl" />
            <p className="ms-2 text-base hidden sm:flex">Silence Remove</p>
          </button>
        </div>
        {/* Audio Controls */}
        <div className="grow flex items-center justify-center gap-x-2">
          <button
            title="Backward"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            disabled={!audioUrl || isRemovingSilence}
            onClick={() => handleFrameNavigation('backward')}
          >
            <AiFillBackward className="text-lg sm:text-xl" />
          </button>
          <button
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={handlePlayAndPause}
            disabled={!audioUrl || isRemovingSilence}
            className="p-3 mx-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            {isPlaying ? (
              <IoPause className="text-xl sm:text-2xl" />
            ) : (
              <IoPlay className="text-xl sm:text-2xl" />
            )}
          </button>
          <button
            title="Forward"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            disabled={!audioUrl || isRemovingSilence}
            onClick={() => handleFrameNavigation('forward')}
          >
            <AiFillForward className="text-lg sm:text-xl" />
          </button>
          <p className="text-sm sm:text-base ms-2 text-gray-500 flex gap-x-1">
            <span ref={timeDisplayRef} className="w-16">
              00:00:00
            </span>
            /<span>{formatMediaTime(duration)}</span>
          </p>
        </div>
        <div className="hidden lg:flex items-center">
          {/* <button
            title="Zoom 100%"
            className="ms-4 py-2 px-4 rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={() => setZoom(100)}
          >
            Fit to screen
          </button> */}
        </div>
      </div>
      {/* Audio Visualizer */}
      <div
        ref={timelineRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full mt-4 h-32 relative flex flex-col px-4 overflow-x-auto no-scrollbar"
      >
        {isRemovingSilence && <SilenceRemovalScreen />}
        {/* Playhead */}
        <div
          ref={seekerRef}
          className="absolute top-0 left-1/2 h-full flex flex-col items-center cursor-pointer z-40"
          style={{
            transitionProperty: 'left',
            transitionDuration: isPlaying ? '100ms' : '0ms',
            transitionTimingFunction: 'linear',
          }}
        >
          <div className="w-0 h-0 border-l-[10px] translate-y-2 border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-blue-500"></div>
          <div className="w-0.5 grow bg-blue-500"></div>
        </div>
        {/* Time Markers */}
        <div
          ref={markersRef}
          className="flex gap-x-4 justify-between items-center min-w-full w-max xl:w-full border-b border-gray-200"
        >
          {markers.map((marker, index) => {
            if (marker.type === AudioTimeBlockType.MAJOR) {
              return (
                <span key={index} className="text-gray-500">
                  {marker.label}
                </span>
              );
            } else {
              return (
                <div
                  key={index}
                  className="w-1 h-1 rounded-full bg-gray-200"
                ></div>
              );
            }
          })}
        </div>
        {/* Waveform and Blocks */}
        <div
          style={{ width: `${markersWidth}px` }}
          className="grow flex items-end"
        >
          {blocks.map((block) => (
            <AudioBlock
              key={block.id}
              block={block}
              totalBlocksSize={totalBlocksSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
