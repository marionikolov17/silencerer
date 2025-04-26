'use client';

import { AppMachineContext } from '@/state-machine/app';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useState } from 'react';

export default function Uploader() {
  const appMachineActorRef = AppMachineContext.useActorRef();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    appMachineActorRef.send({
      type: 'event.import_media',
      files,
    });
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    appMachineActorRef.send({
      type: 'event.import_media',
      files,
    });
    e.target.value = '';
  };

  return (
    <div
      className={`w-full py-8 rounded-lg border-[1px] border-dashed ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } flex flex-col items-center justify-center gap-y-2`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <IoCloudUploadOutline
        className={`text-4xl ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
      />
      <p
        className={`text-sm ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
      >
        Drag and drop your audio files here
      </p>
      <p className="text-xs text-gray-400">or</p>
      <label
        htmlFor="audioFiles"
        className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300"
      >
        Browse Files
      </label>
      <input
        type="file"
        name="audioFiles"
        id="audioFiles"
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
}
