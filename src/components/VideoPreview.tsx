'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { fetchVideoFromBlocks } from '@/utils/video';
import { Block } from '@/types/blocks';
import { usePlayer } from '@/contexts/player';

interface InputProps {
  setIsMobileMediaOpened: Dispatch<SetStateAction<boolean>>;
  blocks: Block[];
}

export default function VideoPreview({
  setIsMobileMediaOpened,
  blocks,
}: InputProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const { videoRef } = usePlayer();

  useEffect(() => {
    const fetchVideo = async () => {
      if (blocks.length === 0) return;
      const video = await fetchVideoFromBlocks(blocks);
      const blob = new Blob([new Uint8Array(video)], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setVideoSrc(url);
    };

    fetchVideo();
  }, [blocks]);

  return (
    <div className="w-full grow flex flex-col items-center overflow-hidden">
      <div className="w-full grow flex items-center justify-center py-8 px-8 overflow-hidden">
        {/* Place Video here */}
        <div className="bg-black w-full min-h-[250px] sm:w-[600px] sm:h-[338px] 2xl:w-[800px] 2xl:h-[450px]">
          <video
            src={videoSrc ?? undefined}
            muted
            ref={videoRef}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="w-full py-8 flex items-center justify-center">
        <div className="h-12 bg-white rounded-lg flex items-center gap-x-4 px-4 overflow-hidden">
          <p className="text-sm font-medium">Landscape (16:9)</p>
          <button
            className="cursor-pointer flex gap-x-1 items-center hover:bg-gray-100 py-1.5 rounded-lg px-2"
            title="Algorithm Settings"
          >
            <IoSettingsOutline className="text-lg" />
            <p className="text-sm font-medium">Settings</p>
          </button>
        </div>
      </div>
      <div className="w-full flex lg:hidden items-center justify-center pb-8">
        <button
          className="text-sm"
          onClick={() => setIsMobileMediaOpened(true)}
        >
          Change Media
        </button>
      </div>
    </div>
  );
}
