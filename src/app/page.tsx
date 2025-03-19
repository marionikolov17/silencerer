import AddedMedia from '@/components/AddedMedia';
import Header from '@/components/Header';
import VideoPreview from '@/components/VideoPreview';
import AudioPlayer from '@/components/AuidoPlayer';

export default function Home() {
  return (
    <main className="w-full min-h-screen relative flex flex-col overflow-x-hidden">
      <div className="w-full h-[700px] bg-gray-100 flex border-b border-gray-200">
        <AddedMedia />
        <div className="grow flex flex-col">
          <Header />
          <VideoPreview />
        </div>
      </div>
      <div className="w-full grow flex flex-col justify-end">
        <AudioPlayer />
      </div>
    </main>
  );
}
