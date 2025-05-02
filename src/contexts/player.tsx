'use client';

import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { createContext, useContext, useRef, useState } from 'react';

interface PlayerContextType extends ReturnType<typeof useMediaPlayer> {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentTime: number;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const updateCurrentTime = (time: number) => {
    setCurrentTime(time);
  };

  const {
    isPlaying,
    duration,
    seekerRef,
    timelineRef,
    timeDisplayRef,
    handlePlayAndPause,
    handleFrameNavigation,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useMediaPlayer([audioRef, videoRef], updateCurrentTime);

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        duration,
        seekerRef,
        timelineRef,
        timeDisplayRef,
        handlePlayAndPause,
        handleFrameNavigation,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        audioRef,
        videoRef,
        currentTime,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context;
};
