'use client';
import { useState } from 'react';
import AddedMedia from '@/components/AddedMedia';
import Header from '@/components/Header';
import VideoPreview from '@/components/VideoPreview';
import AudioPlayer from '@/components/AuidoPlayer';

export default function Home() {
  const [isMobileMediaOpened, setIsMobileMediaOpened] = useState(false);

  return (
    <main className="w-full min-h-screen relative flex flex-col overflow-x-hidden">
      <div className="w-full min-h-[450px] lg:h-[700px] bg-gray-100 flex border-b border-gray-200 relative">
        <AddedMedia
          isMobileMediaOpened={isMobileMediaOpened}
          setIsMobileMediaOpened={setIsMobileMediaOpened}
        />
        <div className="grow flex flex-col w-full sm:w-auto">
          <Header />
          <VideoPreview setIsMobileMediaOpened={setIsMobileMediaOpened} />
        </div>
      </div>
      <div className="w-full grow flex flex-col justify-end">
        <AudioPlayer />
      </div>
    </main>
  );
}
