'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { CiMenuKebab } from 'react-icons/ci';
import { FiCheck, FiEdit2 } from 'react-icons/fi';
import { AppMachineContext } from '@/state-machine/app';
import useHandleClickOutside from '@/hooks/useHandleClickOutside';
import {
  PiFileAudioLight,
  PiFileVideoLight,
  PiTrashBold,
} from 'react-icons/pi';
import { cn } from '@/utils/cn';
import { isFileVideo } from '@/utils/files';
import { GoPlus } from 'react-icons/go';

export default function AddedMediaItem({ file }: { file: File }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(file.name);
  const [screenWidth, setScreenWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayFileName = useMemo(() => {
    if (file.name.length > 40) {
      return file.name.slice(0, 38) + '...';
    }
    return file.name;
  }, [file.name]);

  const appMachineActorRef = AppMachineContext.useActorRef();

  const isVideo = isFileVideo(file);

  useHandleClickOutside(containerRef, () => setIsMenuOpen(false));

  useEffect(() => {
    setScreenWidth(window.screen.width);

    const handleResize = () => {
      setScreenWidth(window.screen.width);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('scroll', scrollListener);

    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  const handleRemoveMedia = () => {
    appMachineActorRef.send({
      type: 'event.remove_media',
      fileName: file.name,
    });
  };

  const openRenameModal = () => {
    setIsRenaming(true);
    setIsMenuOpen(false);
  };

  const handleRenameMedia = () => {
    appMachineActorRef.send({
      type: 'event.rename_media',
      fileName: file.name,
      newName: name,
    });
    setIsRenaming((value) => (value === false ? value : false));
  };

  const handleLoadFile = () => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;

      if (arrayBuffer instanceof ArrayBuffer) {
        appMachineActorRef.send({
          type: 'event.load_file',
          buffer: arrayBuffer,
          file,
        });
      }
    };

    reader.onerror = (event) => {
      console.log('Error', event);
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-visible"
      onDoubleClick={handleLoadFile}
    >
      <div className="w-full h-12 rounded-lg border border-gray-200 flex items-center px-2 py-1 hover:ring-2 hover:ring-blue-500 transition-all duration-300">
        <div
          className={cn(
            'w-full h-full flex items-center',
            !isRenaming && 'hidden',
          )}
        >
          <input
            type="text"
            className="grow h-full p-2 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleRenameMedia}
            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <FiCheck />
          </button>
        </div>
        <div
          className={cn(
            'w-full flex items-center gap-x-2',
            isRenaming && 'hidden',
          )}
        >
          {isVideo ? (
            <PiFileVideoLight
              title="Video"
              className="text-2xl text-blue-500"
            />
          ) : (
            <PiFileAudioLight
              title="Audio"
              className="text-2xl text-blue-500"
            />
          )}
          <div className="grow overflow-hidden">
            <p className="text-base grow ms-2">{displayFileName}</p>
          </div>
          <button
            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300"
            title="Load File"
            onClick={handleLoadFile}
          >
            <GoPlus className="text-xl" />
          </button>
          <button
            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300"
            title="Options"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <CiMenuKebab className="text-xl" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className="bg-white border fixed z-50 shadow-lg border-gray-200 rounded-lg w-48 h-max flex flex-col items-center overflow-hidden"
          style={{
            top: containerRef.current
              ? screenWidth > 700
                ? containerRef.current.getBoundingClientRect().bottom -
                  35 +
                  'px'
                : containerRef.current.getBoundingClientRect().bottom -
                  10 +
                  'px'
              : '0',
            left: containerRef.current
              ? screenWidth > 700
                ? containerRef.current.getBoundingClientRect().right - 5 + 'px'
                : containerRef.current.getBoundingClientRect().left + 130 + 'px'
              : '0',
          }}
        >
          <button
            onClick={openRenameModal}
            className="w-full flex py-2 px-4 items-center gap-x-2 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          >
            <FiEdit2 className="text-lg" />
            <p className="text-sm">Rename</p>
          </button>
          <button
            onClick={handleRemoveMedia}
            className="w-full flex py-2 px-4 text-red-500 items-center gap-x-2 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          >
            <PiTrashBold className="text-lg" />
            <p className="text-sm">Remove</p>
          </button>
        </div>
      )}
    </div>
  );
}
