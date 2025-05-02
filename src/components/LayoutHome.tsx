import { useState } from 'react';
import { AppMachineContext } from '@/state-machine/app';
import { PlayerProvider } from '@/contexts/player';
import AddedMedia from './AddedMedia';
import AudioPlayer from './AudioPlayer';
import Header from './Header';
import VideoPreview from './VideoPreview';

export default function LayoutHome() {
  const [isMobileMediaOpened, setIsMobileMediaOpened] = useState(false);

  const blocks = AppMachineContext.useSelector((state) => state.context.blocks);

  return (
    <PlayerProvider>
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
          <AudioPlayer blocks={blocks} />
        </div>
      </main>
    </PlayerProvider>
  );
}
