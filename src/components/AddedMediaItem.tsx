'use client';
import useHandleClickOutside from '@/hooks/useHandleClickOutside';
import { useState } from 'react';
import { useRef } from 'react';
import { CiMenuKebab } from 'react-icons/ci';
import { FiEdit2 } from 'react-icons/fi';
import { PiFileAudioLight, PiTrashBold } from 'react-icons/pi';

export default function AddedMediaItem({ name }: { name: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useHandleClickOutside(containerRef, () => setIsMenuOpen(false));

  return (
    <div ref={containerRef} className="relative overflow-x-visible">
      <div className="w-full h-12 rounded-lg border border-gray-200 flex items-center px-2 py-1 hover:ring-2 hover:ring-blue-500 transition-all duration-300">
        <PiFileAudioLight className="text-2xl text-blue-500" />
        <div className="grow overflow-hidden">
          <p className="text-base grow ms-2">{name}</p>
        </div>
        <button
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300"
          title="Options"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <CiMenuKebab className="text-xl" />
        </button>
      </div>
      {isMenuOpen && (
        <div
          className="bg-white border fixed z-50 shadow-lg border-gray-200 rounded-lg w-48 h-max flex flex-col items-center overflow-hidden"
          style={{
            top: containerRef.current
              ? containerRef.current.getBoundingClientRect().bottom - 35 + 'px'
              : '0',
            left: containerRef.current
              ? containerRef.current.getBoundingClientRect().right - 5 + 'px'
              : '0',
          }}
        >
          <button className="w-full flex py-2 px-4 items-center gap-x-2 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
            <FiEdit2 className="text-lg" />
            <p className="text-sm">Rename</p>
          </button>
          <button className="w-full flex py-2 px-4 text-red-500 items-center gap-x-2 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
            <PiTrashBold className="text-lg" />
            <p className="text-sm">Remove</p>
          </button>
        </div>
      )}
    </div>
  );
}
