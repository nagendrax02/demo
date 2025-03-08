import { trackError } from 'common/utils/experience/utils/track-error';
import { IDuration } from './audio-player.types';

export const getAudioTimeInMinuteAndSeconds = (totalDuration: number): IDuration => {
  try {
    const seconds = parseInt(`${totalDuration % 60}`, 10);
    const minutes = parseInt(`${totalDuration / 60}`, 10);
    return { seconds, minutes };
  } catch (error) {
    trackError('failed to handle parse total duration to minutes and seconds', error);
    return { seconds: 0, minutes: 0 };
  }
};

export const getAudioDuration = (audioRef: React.RefObject<HTMLAudioElement>): IDuration => {
  const audioDuration = audioRef.current?.duration ? Math.floor(audioRef.current?.duration) : 0;
  return getAudioTimeInMinuteAndSeconds(audioDuration);
};

export const getTotalDuration = (audioSeekTime: number, trackDuration: number): number => {
  try {
    const value = (Math.round(audioSeekTime) / trackDuration) * 100;
    return Math.round(value);
  } catch (error) {
    trackError('failed to calculate totalDuration for background property', error);
    return 0;
  }
};

export const isValidRecordingURL = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!url?.startsWith('https://')) {
      resolve(false);
      return;
    }

    const audioElement = document.createElement('audio');
    audioElement.style.display = 'none';
    audioElement.preload = 'auto';

    const resolveCleanup = (result: boolean): void => {
      document.body.removeChild(audioElement);
      resolve(result);
    };

    const source = document.createElement('source');
    source.src = url;
    source.onerror = (): void => {
      resolveCleanup(false);
    };

    audioElement.oncanplaythrough = (): void => {
      resolveCleanup(true);
    };

    audioElement.appendChild(source);
    document.body.appendChild(audioElement);
  });
};

export const shouldEnableDownload = (
  fileURL: string | null | undefined,
  enableDownload: boolean
): boolean => {
  if (!fileURL || typeof fileURL !== 'string') {
    return false;
  }
  try {
    return new URL(fileURL).protocol === 'https:' ? enableDownload : false;
  } catch (error) {
    return false;
  }
};
