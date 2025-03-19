'use client';

import { AiFillBackward, AiFillForward } from 'react-icons/ai';
import { CiZoomIn, CiZoomOut } from 'react-icons/ci';
import { IoCutOutline, IoPlay } from 'react-icons/io5';
import useAudioTimeBlocks, {
  AudioTimeBlockType,
} from '@/hooks/useAudioTimeBlocks';

export default function AudioPlayer() {
  const exampleDuration = 60;

  const markers = useAudioTimeBlocks(exampleDuration);

  return (
    <div className="w-full flex flex-col pb-2">
      <div className="w-full h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            title="Silence Remove"
            className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-lg"
          >
            <IoCutOutline className="text-2xl" />
            <p className="ms-2 text-base">Silence Remove</p>
          </button>
        </div>
        {/* Audio Controls */}
        <div className="grow flex items-center justify-center gap-x-2">
          <button
            title="Backward"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <AiFillBackward className="text-xl" />
          </button>
          <button
            title="Play"
            className="p-3 mx-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <IoPlay className="text-2xl" />
          </button>
          <button
            title="Forward"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <AiFillForward className="text-xl" />
          </button>
          <p className="ms-2 text-gray-500">00:00:00 / 01:00:00</p>
        </div>
        <div className="flex items-center">
          <ZoomController />
          <button
            title="Zoom 100%"
            className="ms-4 py-2 px-4 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            Fit to screen
          </button>
        </div>
      </div>
      {/* Audio Visualizer */}
      <div className="w-full mt-4 h-32 relative flex flex-col px-4">
        {/* Playhead */}
        <div className="absolute top-0 left-1/2 h-full flex flex-col items-center cursor-pointer">
          <div className="w-0 h-0 border-l-[10px] translate-y-2 border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-blue-500"></div>
          <div className="w-0.5 grow bg-blue-500"></div>
        </div>
        {/* Time Markers */}
        <div className="flex gap-x-4 justify-between items-center">
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
        <div className="w-full h-[1px] bg-gray-200"></div>
        {/* Waveform and Blocks */}
        <div className="w-full grow"></div>
      </div>
    </div>
  );
}

function ZoomController() {
  return (
    <div className="flex items-center gap-x-4">
      <button
        title="Zoom In"
        className="rounded-full flex items-center justify-center cursor-pointer hover:text-blue-500"
      >
        <CiZoomIn className="text-2xl" />
      </button>
      <div className="w-40 h-full relative flex items-center">
        <div className="w-full h-0.5 bg-gray-200">
          <div className="w-1/2 h-full bg-blue-500"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-4 h-4 border-3 border-blue-500 bg-white cursor-pointer"></div>
      </div>
      <button
        title="Zoom Out"
        className="rounded-full flex items-center justify-center cursor-pointer hover:text-blue-500"
      >
        <CiZoomOut className="text-2xl" />
      </button>
    </div>
  );
}
