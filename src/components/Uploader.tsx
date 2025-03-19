'use client';

import { IoCloudUploadOutline } from 'react-icons/io5';

export default function Uploader() {
  return (
    <div className="w-full py-8 rounded-lg border-[1px] border-dashed border-gray-300 flex flex-col items-center justify-center gap-y-2">
      <IoCloudUploadOutline className="text-4xl text-gray-400" />
      <p className="text-sm text-gray-400">
        Drag and drop your audio files here
      </p>
      <p className="text-xs text-gray-400">or</p>
      <label className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300">
        Browse Files
      </label>
      <input type="file" name="audioFiles" id="audioFiles" className="hidden" />
    </div>
  );
}
