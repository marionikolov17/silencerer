'use client';

import { IoSettingsOutline } from 'react-icons/io5';

export default function VideoPreview() {
  return (
    <div className="w-full grow flex flex-col items-center overflow-hidden">
      <div className="w-full grow flex items-center justify-center py-8 px-8 overflow-hidden">
        {/* Place Video here */}
        <div className="bg-black w-[800px] h-[450px]"></div>
      </div>
      <div className="w-full py-8 flex items-center justify-center">
        <div className="h-12 bg-white rounded-lg flex items-center gap-x-4 px-4 overflow-hidden">
          <p className="text-sm font-medium">Landscape (16:9)</p>
          <button
            className="cursor-pointer flex gap-x-1 items-center hover:bg-gray-100 py-1.5 rounded-lg px-2"
            title="Algorithm Settings"
          >
            <IoSettingsOutline className="text-lg" />
            <p className="text-sm font-medium">Settings</p>
          </button>
        </div>
      </div>
    </div>
  );
}

/* function SignalVisualizer() {
    return (
        <div className="flex h-80">
            <div className="w-10 flex flex-col">
                <div className="w-full h-6"></div>
            </div>
            <div className="w-24 h-full border border-gray-300 rounded-lg flex flex-col">
                <div className="w-full flex h-6 border-b border-gray-300">
                    <div className="grow w-1/2 flex items-center justify-center border-r border-gray-300">
                        <p>L</p>
                    </div>
                    <div className="grow w-1/2 flex items-center justify-center">
                        <p>R</p>
                    </div>
                </div>
                <div className="w-full grow flex">
                    <div className="grow w-1/2 border-r border-gray-300"></div>
                    <div className="grow w-1/2"></div>
                </div>
            </div>
        </div>
    )
} */
