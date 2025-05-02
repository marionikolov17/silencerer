import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { formatMediaTime } from '@/utils/time';
export interface MediaPlayer {
  isPlaying: boolean;
  duration: number;
  seekerRef: React.RefObject<HTMLDivElement | null>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  timeDisplayRef: React.RefObject<HTMLDivElement | null>;
  handlePlayAndPause: () => void;
  handleFrameNavigation: (direction: 'forward' | 'backward') => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
}

export const useMediaPlayer = (
  refs: React.RefObject<HTMLVideoElement | HTMLAudioElement | null>[],
  updateCurrentTime: (time: number) => void,
): MediaPlayer => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  const seekerRef = useRef<HTMLDivElement>(null);
  const timeDisplayRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Handlers
  const manipulateRefs = useCallback(
    (fn: (ref: RefObject<HTMLVideoElement | HTMLAudioElement>) => void) => {
      refs.forEach((ref) => {
        if (ref.current) {
          fn(ref as RefObject<HTMLVideoElement | HTMLAudioElement>);
        }
      });
    },
    [refs],
  );

  const updateDisplayTime = useCallback(
    (element: HTMLAudioElement | HTMLVideoElement) => {
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = formatMediaTime(
          element.currentTime,
        );
      }
    },
    [],
  );

  const updateSeekerPosition = useCallback(
    (reference: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
      const element = reference.current as HTMLAudioElement | HTMLVideoElement;

      if (seekerRef.current) {
        seekerRef.current.style.left = `${(element.currentTime / element.duration) * 100}%`;
      }
    },
    [],
  );

  /* const handleTimeUpdate = useCallback(() => {
    if (!ref.current) return;

    const element = ref.current as HTMLAudioElement | HTMLVideoElement;

    setDuration(element.duration);
    updateCurrentTime(element.currentTime);

    updateSeekerPosition(ref as RefObject<HTMLVideoElement | HTMLAudioElement>);

    updateDisplayTime(element);
  }, [ref, updateCurrentTime, updateDisplayTime, updateSeekerPosition]); */

  const handleTimeUpdate = useCallback(() => {
    manipulateRefs((ref: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
      const element = ref.current as HTMLAudioElement | HTMLVideoElement;

      setDuration(element.duration);
      updateCurrentTime(element.currentTime);
      updateSeekerPosition(ref);
      updateDisplayTime(element);
    });
  }, [
    manipulateRefs,
    updateCurrentTime,
    updateDisplayTime,
    updateSeekerPosition,
  ]);

  /* const handlePlayAndPause = useCallback(() => {
    if (!ref.current) return;

    const element = ref.current as HTMLAudioElement | HTMLVideoElement;

    if (isPlaying) {
      element.pause();
      setIsPlaying(false);
    } else {
      element.play();
      setIsPlaying(true);
    }
  }, [ref, isPlaying]); */

  const handlePlayAndPause = useCallback(() => {
    manipulateRefs((ref: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
      const element = ref.current as HTMLAudioElement | HTMLVideoElement;

      if (isPlaying) {
        element.pause();
        setIsPlaying(false);
      } else {
        element.play();
        setIsPlaying(true);
      }
    });
  }, [manipulateRefs, isPlaying]);

  /* const handleSeek = useCallback(
    (clientX: number) => {
      if (!ref.current || !timelineRef.current) return;

      const element = ref.current as HTMLAudioElement | HTMLVideoElement;

      const rect = timelineRef.current.getBoundingClientRect();
      const percent = (clientX - rect.left) / rect.width;
      const newTime = Math.min(
        Math.max(percent * element.duration, 0),
        element.duration,
      );

      element.currentTime = newTime;
      handleTimeUpdate();
    },
    [ref, timelineRef, handleTimeUpdate],
  ); */

  const handleSeek = useCallback(
    (clientX: number) => {
      manipulateRefs((ref: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
        const element = ref.current as HTMLAudioElement | HTMLVideoElement;

        const rect = timelineRef.current!.getBoundingClientRect();
        const percent = (clientX - rect.left) / rect.width;
        const newTime = Math.min(
          Math.max(percent * element.duration, 0),
          element.duration,
        );

        element.currentTime = newTime;
        handleTimeUpdate();
      });
    },
    [manipulateRefs, handleTimeUpdate],
  );

  /* const handleFrameNavigation = useCallback(
    (direction: 'forward' | 'backward') => {
      if (!ref.current) return;

      const element = ref.current as HTMLAudioElement | HTMLVideoElement;

      const frameDuration = 1 / 24;
      const newTime =
        element.currentTime +
        (direction === 'forward' ? frameDuration : -frameDuration);

      element.currentTime = Math.min(Math.max(newTime, 0), element.duration);
      handleTimeUpdate();
    },
    [ref, handleTimeUpdate],
  ); */

  const handleFrameNavigation = useCallback(
    (direction: 'forward' | 'backward') => {
      manipulateRefs((ref: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
        const element = ref.current as HTMLAudioElement | HTMLVideoElement;

        const frameDuration = 1 / 24;
        const newTime =
          element.currentTime +
          (direction === 'forward' ? frameDuration : -frameDuration);

        element.currentTime = Math.min(Math.max(newTime, 0), element.duration);
        handleTimeUpdate();
      });
    },
    [manipulateRefs, handleTimeUpdate],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleSeek(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle smooth playback
  /*   useEffect(() => {
    if (!ref.current) return;

    const element = ref.current as HTMLAudioElement | HTMLVideoElement;

    const handleLoadedMetadata = () => {
      handleTimeUpdate();
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const animate = () => {
      if (!element.paused && !element.ended) {
        updateCurrentTime(element.currentTime);
        updateSeekerPosition(
          ref as RefObject<HTMLVideoElement | HTMLAudioElement>,
        );
        updateDisplayTime(element);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrameRef.current as number);
      }
    };

    element.addEventListener('loadedmetadata', handleLoadedMetadata);
    element.addEventListener('play', animate);
    element.addEventListener('pause', animate);
    element.addEventListener('ended', handleEnded);

    return () => {
      element.removeEventListener('loadedmetadata', handleLoadedMetadata);
      element.removeEventListener('play', animate);
      element.removeEventListener('pause', animate);
      element.removeEventListener('ended', handleEnded);
    };
  }, [
    handleTimeUpdate,
    ref,
    updateCurrentTime,
    updateDisplayTime,
    updateSeekerPosition,
  ]); */

  useEffect(() => {
    manipulateRefs((ref: RefObject<HTMLVideoElement | HTMLAudioElement>) => {
      const element = ref.current as HTMLAudioElement | HTMLVideoElement;

      const handleLoadedMetadata = () => {
        handleTimeUpdate();
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      const animate = () => {
        if (!element.paused && !element.ended) {
          updateCurrentTime(element.currentTime);
          updateSeekerPosition(ref);
          updateDisplayTime(element);
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      const handleAudioStatus = () => {
        if (element.paused) {
          cancelAnimationFrame(animationFrameRef.current as number);
        } else {
          animate();
        }
      };

      element.addEventListener('loadedmetadata', handleLoadedMetadata);
      element.addEventListener('play', handleAudioStatus);
      element.addEventListener('pause', handleAudioStatus);
      element.addEventListener('ended', handleEnded);

      return () => {
        element.removeEventListener('loadedmetadata', handleLoadedMetadata);
        element.removeEventListener('play', handleAudioStatus);
        element.removeEventListener('pause', handleAudioStatus);
        element.removeEventListener('ended', handleEnded);
      };
    });
  }, [
    manipulateRefs,
    handleTimeUpdate,
    updateCurrentTime,
    updateDisplayTime,
    updateSeekerPosition,
  ]);

  return {
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
  };
};
