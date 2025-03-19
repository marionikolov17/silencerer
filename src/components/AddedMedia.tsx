'use client';

import AddedMediaItem from './AddedMediaItem';
import Uploader from './Uploader';

export default function AddedMedia() {
  return (
    <div className="w-[500px] h-full flex flex-col gap-y-4 px-8 py-6 bg-white border-r border-gray-200 relative">
      <h1 className="text-xl font-bold">Added Media</h1>
      <Uploader />
      <div className="w-full grow flex flex-col overflow-y-auto overflow-x-hidden p-1 gap-y-4">
        <AddedMediaItem name="testing-audiofile.mp3" />
        <AddedMediaItem name="clipping.mp3" />
        <AddedMediaItem name="awesome-audio.mp3" />
      </div>
    </div>
  );
}
