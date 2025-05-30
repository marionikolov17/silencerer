'use client';

import { Dispatch, SetStateAction } from 'react';
import AddedMediaItem from './AddedMediaItem';
import Uploader from './Uploader';
import { IoCloseOutline } from 'react-icons/io5';
import { AppMachineContext } from '@/state-machine/app';

interface InputProps {
  isMobileMediaOpened: boolean;
  setIsMobileMediaOpened: Dispatch<SetStateAction<boolean>>;
}

export default function AddedMedia({
  isMobileMediaOpened,
  setIsMobileMediaOpened,
}: InputProps) {
  const files = AppMachineContext.useSelector((state) => state.context.files);

  return (
    <div
      className={`w-full sm:w-[400px] xl:w-[500px] shrink-0 h-full ${isMobileMediaOpened ? 'flex' : 'hidden lg:flex'} flex-col gap-y-4 px-8 py-6 bg-white border-r border-gray-200 absolute lg:relative`}
    >
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-bold">Added Media</h1>
        <button
          className="flex lg:hidden"
          onClick={() => setIsMobileMediaOpened(false)}
        >
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>
      <Uploader />
      <div className="w-full grow flex flex-col overflow-y-auto overflow-x-hidden p-1 gap-y-4">
        {files.map((file) => (
          <AddedMediaItem key={file.name} file={file} />
        ))}
      </div>
    </div>
  );
}
