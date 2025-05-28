import { useState } from 'react';
import { AppMachineContext } from '@/state-machine/app';
import { PlayerProvider } from '@/contexts/player';
import AddedMedia from './AddedMedia';
import AudioPlayer from './AudioPlayer';
import Header from './Header';
import VideoPreview from './VideoPreview';
import { IoSettingsOutline } from 'react-icons/io5';
import SilencerSettings from './SilencerSettings';
import ExportWindow from './ExportWindow';

export default function LayoutHome() {
  const [isMobileMediaOpened, setIsMobileMediaOpened] = useState(false);
  const [isSettingsOpened, setIsSettingsOpened] = useState(false);
  const [isExportWindowOpened, setIsExportWindowOpened] = useState(false);

  const blocks = AppMachineContext.useSelector((state) => state.context.blocks);

  const openSettings = () => {
    setIsSettingsOpened(true);
  };

  const closeSettings = () => {
    setIsSettingsOpened(false);
  };

  const openExportWindow = () => {
    setIsExportWindowOpened(true);
  };

  const closeExportWindow = () => {
    setIsExportWindowOpened(false);
  };

  return (
    <PlayerProvider>
      <main className="w-full min-h-screen relative flex flex-col overflow-x-hidden">
        {isExportWindowOpened && (
          <ExportWindow closeExportWindow={closeExportWindow} />
        )}
        {isSettingsOpened && <SilencerSettings closeSettings={closeSettings} />}
        <div className="w-full min-h-[450px] lg:h-[700px] bg-gray-100 flex border-b border-gray-200 relative">
          <AddedMedia
            isMobileMediaOpened={isMobileMediaOpened}
            setIsMobileMediaOpened={setIsMobileMediaOpened}
          />
          <div className="grow flex flex-col w-full sm:w-auto">
            <Header openExportWindow={openExportWindow} />
            <VideoPreview />
            <div className="w-full py-8 flex items-center justify-center">
              <div className="h-12 bg-white rounded-lg flex items-center gap-x-4 px-4 overflow-hidden">
                <p className="text-sm font-medium">Landscape (16:9)</p>
                <button
                  className="cursor-pointer flex gap-x-1 items-center hover:bg-gray-100 py-1.5 rounded-lg px-2"
                  title="Algorithm Settings"
                  onClick={openSettings}
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
        </div>
        <div className="w-full grow flex flex-col justify-end">
          <AudioPlayer blocks={blocks} />
        </div>
      </main>
    </PlayerProvider>
  );
}
