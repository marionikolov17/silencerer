'use client';

export default function VideoPreview() {
  return (
    <div className="w-full grow flex flex-col items-center overflow-hidden">
      <div className="w-full grow flex items-center justify-center py-8 px-8 overflow-hidden">
        {/* Place Video here */}
        <div className="bg-black w-full min-h-[250px] sm:w-[600px] sm:h-[338px] 2xl:w-[800px] 2xl:h-[450px]"></div>
      </div>
    </div>
  );
}
